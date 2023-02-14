import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import { Listing, ListingData } from '../components/Category';
import ListingItem from '../components/ListingItem';

const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<ListingData[] | null>(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
  });
  const [changeDetails, setChangeDetails] = useState(false);

  const { name, email } = formData;
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    (async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser?.uid)
      );
      const querySnap = await getDocs(q);

      const listings: ListingData[] = [];

      querySnap.forEach((doc) =>
        listings.push({
          id: doc.id,
          data: doc.data() as Listing,
        })
      );

      setListings(listings);
      setLoading(false);
    })();
  }, [auth.currentUser?.uid]);

  const onSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name && auth.currentUser) {
        // Update display name
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could't update profile details");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onDelete = async (listingId: string) => {
    if (window.confirm('Are you sure want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      if (listings) {
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId
        );
        setListings(updatedListings);
        toast.success('Successfully deleted listing');
      }
    }
  };

  const onEdit = async (listingId: number) =>
    navigate(`/edit-listing/${listingId}`);

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button className='logOut' type='button' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prev) => !prev);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profileCard'>
          <form>
            <input
              type='text'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              id='name'
              name='name'
              disabled={!changeDetails}
              onChange={onChange}
              value={name}
            />
            <input
              type='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              id='email'
              name='email'
              disabled={!changeDetails}
              // onChange={onChange}
              value={email}
            />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsMap'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;

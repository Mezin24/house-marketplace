import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { Listing as ListingData } from '../components/Category';
import { formatter } from '../utils/formatter';

type ListingParams = {
  categoryName: string;
  listingId: string;
};

const Listing = () => {
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setloading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const auth = getAuth();

  const navigate = useNavigate();
  const { categoryName, listingId } = useParams<ListingParams>();

  useEffect(() => {
    (async () => {
      if (!listingId) return;

      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data() as ListingData);
        setloading(false);
      }
    })();
  }, [navigate, listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* Slider */}

      <div
        className='shareIconDiv'
        onClick={() => {
          console.log(navigator);
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='share' />
      </div>

      {shareLinkCopied && <p className='linkCopy'>Link Copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing?.name} -{' '}
          {listing?.offer
            ? listing.discountedPrice &&
              formatter.format(listing.discountedPrice)
            : listing?.regularPrice && formatter.format(listing?.regularPrice)}
        </p>
        <p className='listingLocation'>{listing?.location}</p>
        <p className='listingType'>
          For {listing?.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing?.offer && listing.discountedPrice && listing.regularPrice && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className='listingDetailsList'>
          <li>
            {listing?.bedrooms && listing?.bedrooms > 1
              ? `${listing?.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing?.bathrooms && listing?.bathrooms > 1
              ? `${listing?.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          {listing?.parking && <li>Parking Spot</li>}
          {listing?.furnished && <li>Furnished</li>}
        </ul>

        <p className='listingLocationTitle'>Location</p>
        {/* Map */}

        {auth.currentUser?.uid !== listing?.userRef && (
          <Link
            to={`/contact/${listing?.userRef}?listingName=${
              listing && listing.name
            }`}
            className='primaryButton'
          >
            Contact Landloard
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;

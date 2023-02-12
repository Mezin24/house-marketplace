import { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';

const Profile = () => {
  const auth = getAuth();
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
      </main>
    </div>
  );
};

export default Profile;

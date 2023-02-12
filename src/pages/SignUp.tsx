import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import invisibleIcon from '../assets/svg/invisibleIcon.svg';
import { db } from '../../firebase.config';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValue, setFormValue] = useState({
    name: '',
    password: '',
    email: '',
  });

  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const { email: userEmail, name: userName } = formValue;
      const userData = {
        name: userName,
        email: userEmail,
        timeStamp: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: name,
        });

        navigate('/');
      }
    } catch (error) {
      toast.error('Something went wrong with registration');
    }
  };

  const { name, email, password } = formValue;

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome!</p>
        </header>
        <form onSubmit={submitHandler}>
          <input
            type='text'
            className='nameInput'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
          />
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            name='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              name='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={showPassword ? invisibleIcon : visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prev) => !prev)}
            />
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </button>
            </div>
          </div>
        </form>

        <OAuth />
        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
    </>
  );
};

export default SignUp;

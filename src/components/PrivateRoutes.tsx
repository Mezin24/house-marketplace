import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoutess = () => {
  const { checkingStatus, loggedIn } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoutess;

import { Outlet } from 'react-router-dom';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <>
      <div className='container'>{<Outlet />}</div>
      <Navbar />
      <ToastContainer />
    </>
  );
};

export default RootLayout;

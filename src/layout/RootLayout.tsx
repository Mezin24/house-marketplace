import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <>
      {<Outlet />}
      <Navbar />
      <ToastContainer />
    </>
  );
};

export default RootLayout;

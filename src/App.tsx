import { createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

// pages
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoutes from './components/PrivateRoutes';
import Category from './components/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';

// layout
import RootLayout from './layout/RootLayout';
import Contact from './components/Contact';
import EditListing from './pages/EditListing';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Explore />} />
      <Route path='offers' element={<Offers />} />
      <Route path='category'>
        <Route path=':categoryName' element={<Category />} />
      </Route>
      <Route path='profile' element={<PrivateRoutes />}>
        <Route index element={<Profile />} />
      </Route>
      <Route path='sign-in' element={<SignIn />} />
      <Route path='sign-up' element={<SignUp />} />
      <Route path='create-listing' element={<CreateListing />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='category/:categoryName/:listingId' element={<Listing />} />
      <Route path='contact/:landlordId' element={<Contact />} />
      <Route path='edit-listing/:listingId' element={<EditListing />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

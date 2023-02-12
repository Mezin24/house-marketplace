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

// layout
import RootLayout from './layout/RootLayout';

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
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

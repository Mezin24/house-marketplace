import { NavLink, useLocation } from 'react-router-dom';

import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOuttlineIcon } from '../assets/svg/personOutlineIcon.svg';

const Navbar = () => {
  const { pathname } = useLocation();

  const pathMatchRoute = (route: string) => route === pathname;

  return (
    <footer className='navbar'>
      <nav className='navbarNav'>
        <ul className='navbarListItems'>
          <NavLink to='/' className='navbarListItem'>
            <ExploreIcon
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p>Explore</p>
          </NavLink>
          <NavLink to='/offers' className='navbarListItem'>
            <OfferIcon
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p>Offer</p>
          </NavLink>
          <NavLink to='/profile' className='navbarListItem'>
            <PersonOuttlineIcon
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p>Profile</p>
          </NavLink>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;

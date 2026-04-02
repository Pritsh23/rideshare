import { NavLink } from 'react-router-dom';

<nav>
  <NavLink to="/create-ride" className={({ isActive }) => isActive ? 'active' : ''}>
    Create Ride
  </NavLink>
</nav>
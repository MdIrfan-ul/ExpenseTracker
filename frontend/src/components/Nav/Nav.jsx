import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Nav.module.css';
import { logout} from '../../features/userReducer';

const NavBar = () => {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state) => state.user);

  const handleLogout = ()=>{
    dispatch(logout());
  }

  return (
    <>
    <nav className={styles.navbar}>
        <input type='checkbox' id='responsive' className={styles.checkBox}/>
        <label htmlFor="responsive" className={styles.navIcon}>
          <span></span>
          <span></span>
          <span></span>
        </label>
        <NavLink to='/'className={styles.navLogo}>Expense Tracker</NavLink>
     <div className={styles.navMenus}>
     {!isAuthenticated? (
          <>
            <NavLink to="/signup" className={styles.navLinks}>Signup</NavLink>
            <NavLink to="/signin" className={styles.navLinks}>Signin</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard"className={styles.navLinks}>Dashboard</NavLink>
            <NavLink to="/transactions" className={styles.navLinks}>Transactions</NavLink>
            <NavLink to="/budgets"   className={styles.navLinks}>Budgets</NavLink>
            <NavLink to="/signin"   className={styles.navLinks} onClick={handleLogout}>Logout</NavLink>
          </>
        )}
        
     </div>

    </nav>
    <Outlet/>
    </>
  );
};

export {NavBar};

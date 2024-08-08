import React, { useEffect, useState } from 'react';
import styles from './Signin.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Login} from '../../features/userReducer';
import { NavLink, useNavigate } from 'react-router-dom';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated,error} = useSelector(state=>state.user);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/dashboard');
    }
  },[isAuthenticated,navigate]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(Login(formData));
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Sign In</h1>
      <form onSubmit={handleSubmit}>
      {error &&<p className={styles.errorMessage}>{error}</p> }
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="enter  email"
            className={styles.formInput}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
             placeholder="enter password"
            className={styles.formInput}
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.formButton}>Sign In</button>
        <p>Don't have an Account?<NavLink to='/signup'> Sign up </NavLink></p>
      </form>
    </div>
  );
}

export  {SignIn};

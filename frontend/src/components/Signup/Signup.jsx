import { useEffect, useState } from "react"
import styles from "./Signup.module.css";
import {useDispatch,useSelector} from "react-redux";
import { register, resetError } from "../../features/userReducer";
import { NavLink, useNavigate } from "react-router-dom";

function SignUp(){
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:''
    });
    const {user,error} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
     
      dispatch(resetError());

      // Redirect to SignIn page if registration is successful
      if (user) {
          navigate('/signin');
      }
  }, [user, navigate, dispatch]);

    

    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(register(formData));
   
    }
    return(
        <>
        <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Sign Up</h1>
      <form onSubmit={handleSubmit}>
      {error && (
                    <ul className={styles.errorList}>
                        {Array.isArray(error) ? (
                            error.map((err, index) => (
                                <li key={index} className={styles.errorMessage}>
                                    {err}
                                </li>
                            ))
                        ) : (
                            <li className={styles.errorMessage}>{error}</li>
                        )}
                    </ul>
                )}
      <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="enter name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="enter email"
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
     
        <button type="submit" className={styles.formButton}>Sign Up</button>
        <p>Have an Account? <NavLink to='/signin'>Sign In</NavLink></p>
      </form>
    </div>
        </>
    )
}

export {SignUp};
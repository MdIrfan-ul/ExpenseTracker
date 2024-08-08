import style from "./page.module.css"
import NotFound from "../../static/images/errorpage.jpg"
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
function Page404(){
    return(
        <>

        <div className={style.error}>
            <img src ={NotFound} alt="not-found"/>
           <NavLink to="/" style={{color:"Black",textDecoration:"underline",padding:'10px'}}><p>Back to Home<FaHome/></p></NavLink> 
        </div>
        </>
    )
}

export default Page404;
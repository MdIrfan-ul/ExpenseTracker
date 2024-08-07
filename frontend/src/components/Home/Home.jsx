import style from "./Home.module.css";
import ExpenseGif from "../../static/images/expenseGif.gif"
import { MdVerifiedUser,MdCategory  } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";
function Home(){
    return (
        <>
         <div className={style.homePageContainer}>
      <div className={style.homeImage}>
        <img src={ExpenseGif} alt="Expense Tracker" />
      </div>
      <div className={style.homePageDetails}>
        <h1>Expense Tracker is a tracking application for users to manage their personal finances.</h1>
        <ul>
          <li><MdVerifiedUser/> User authentication</li>
          <li><GiExpense/> Expense and income tracking</li>
          <li><MdCategory/> Category-wise breakdown</li>
          <li><FaMoneyBillTransfer/> Budget setting and alerts</li>
          <li><VscGraphLine/> Graphical reports and analytics</li>
        </ul>
      </div>
    </div>
        </>
    )
};

export {Home};
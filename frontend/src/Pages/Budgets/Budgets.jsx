import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./Budgets.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addBudget, checkAlerts, deleteBudget, fetchBudgets, updateBudget } from "../../features/budgetReducer";
import { Spinner } from "../../components/Spinner/Spinner";
import {toast } from "react-toastify";

function Budget() {
  const { budgets,loading,error,alerts } = useSelector((state) => state.budget);
  const dispatch = useDispatch();
  const [budgetFormData,setBudgetFormData] = useState({category:"",amount:""});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);


  useEffect(() => {
    if (editingId !== null) {
      const budget = budgets.find((tx) => tx._id === editingId);
      if (budget) {
        setBudgetFormData({
          category: budget.category,
          amount: budget.amount,
        });
      }
    } else {
      setBudgetFormData({
        category: "",
        amount: "",
      });
    }
  }, [editingId, budgets]);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      if (editingId !== null) {
        await dispatch(updateBudget({ id: editingId, budgetFormData })).unwrap();
            toast.success("Budget updated successfully", {
              autoClose: true,
              closeOnClick: true,
            });
            setEditingId(null);
          }
            else{
  await dispatch(addBudget(budgetFormData)).unwrap();
  toast.success("Budget added successfully", {
  autoClose: true,
  closeOnClick: true,
  });
setBudgetFormData({category:"",amount:""});
      }
    } catch (error) {
      toast.error("Error adding/updating budget", {
        autoClose: true,
        closeOnClick: true,
      });
    }
  }


  const handleChange = (e)=>{
    const { name, value } = e.target;
    setBudgetFormData({...budgetFormData,[name]:value})
  }
  const handleEdit=(id)=>{
    setEditingId(id);
  }

  const handleDelete = (id)=>{
    const confirmDeletion = () => {
      dispatch(deleteBudget(id));
      toast.dismiss();
      toast.success("Transaction deleted successfully", 
        {
        autoClose: true,
        closeOnClick: true,
      });
    };
    toast(
      <div >
        Are you sure you want to delete this transaction?
        <button onClick={confirmDeletion} className={styles.alertBtn}>Yes</button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  }

  const handleCancel =()=>{
    setBudgetFormData({
      category: "",
      amount: ""
    });
    setEditingId(null);
  }

  const handleAlerts = ()=>{
   dispatch(checkAlerts());
   if(alerts.length>0){
    toast.info("Budget Alerts Sent to Email",{closeOnClick:true,pauseOnHover:false});
   }
  }


  return (
    <>
      <div className={styles.budgetContainer}>
        <div className={styles.budgetContent}>
          <div className={styles.budgetForm}>
            <h2>{editingId?"Update Budget":"Add Budget"}</h2>
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
                <label htmlFor="category">Category:</label>
                <select name="category" value={budgetFormData.category} onChange={handleChange}>
                  <option>Select Category</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Education">Education</option>
                  <option value="Entertainments">Entertainments</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" placeholder="Amount" name="amount"  value={budgetFormData.amount} onChange={handleChange}/>
              </div>
              <button type="submit" className={styles.submitBtn}>{editingId?"Update Budget":"Add Budget"}</button>
              <button type="button" onClick={handleCancel}
              className={styles.cancelBtn}>Cancel</button>
            </form>
          </div>
          <div className={styles.budgetList}>
            <h2>Budget List</h2>
            <div className={styles.budgetItems}>
              {loading && <Spinner/>}
              {budgets.map((budget) => (
                <div className={styles.budgetItem} key={budget._id}>
                  <span>{budget.category} : &#8377;{budget.amount}</span>
                  <div className={styles.budgetActions}>
                    <button className={styles.UpdateBtn} onClick={()=>handleEdit(budget._id)}>
                      <FaEdit />
                    </button>
                    <button className={styles.DeleteBtn} onClick={()=>handleDelete(budget._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.budgetAlerts}>
          <h2>Budget Alerts</h2>
          <button type="button" onClick={handleAlerts}>Check For Alerts</button>
          {alerts.length === 0 ? (
            <p>No alerts at the moment.</p>
          ) : (
            alerts.map((alert, index) => (
              <div key={index} className={styles.alertItem}>
                <div className={styles.alertCategory}>{alert.category}</div>
                <div className={styles.alertDetails}>Budget: &#8377;{alert.budget}</div>
                <div className={styles.alertDetails}>Total Expenses: &#8377;{alert.totalExpenses}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export { Budget };

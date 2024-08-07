import { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransaction,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../../features/transactionReducer";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./CalenderCustom.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash} from "react-icons/fa6";
import { Spinner } from "../../components/Spinner/Spinner";
import {toast } from "react-toastify";



function Transaction() {
  const dispatch = useDispatch();
  const { transactions, error, loading } = useSelector(
    (state) => state.transaction
  );
  const [transactionData, setTransactionData] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    type: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTransaction());
  }, [dispatch]);

 

  useEffect(() => {
    if (editingId !== null) {
      const transaction = transactions.find((tx) => tx._id === editingId);
      if (transaction) {
        setTransactionData({
          title: transaction.title,
          amount: transaction.amount,
          date: format(new Date(transaction.date), "yyyy-MM-dd"), // Formatting the date,
          category: transaction.category,
          type: transaction.type,
        });
      }
    } else {
      setTransactionData({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "",
      });
    }
  }, [editingId, transactions]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await dispatch(updateTransaction({ id: editingId, transactionData })).unwrap();
  
            toast.success("Transaction updated successfully", {
              autoClose: true,
              closeOnClick: true,
            });
      

        setEditingId(null);
      } else {
       await  dispatch(createTransaction(transactionData)).unwrap();
        toast.success("Transaction added successfully", {
          autoClose: true,
          closeOnClick: true,
        });
      }
      setTransactionData({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "",
      });
    } catch (error) {
        toast.error("Error adding/updating transaction", {
            autoClose: true,
            closeOnClick: true,
          });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  const handleDelete = (id) => {
    const confirmDeletion = () => {
      dispatch(deleteTransaction(id));
      toast.dismiss();
      toast.success("Transaction deleted successfully",{pauseOnHover:false,closeOnClick:true});
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
  };
  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setTransactionData({ ...transactionData, date: formattedDate });
  };
  const handleCancel = () => {
    setTransactionData({
      title: "",
      amount: "",
      date: "",
      category: "",
      type: "income",
    });
    setEditingId(null);
  };
  return (
    <>
<div className={styles.container}>
      <div className={styles.transactionContainer}>
        <div className={styles.transactionFormContainer}>
          <h1>{editingId ? "Update Transaction" : "Add Transaction"}</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
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
            <div>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={transactionData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={transactionData.amount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select name="category" value={transactionData.category} onChange={handleChange}>
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
            <div>
              <label>Type</label>
              <select
                name="type"
                value={transactionData.type}
                onChange={handleChange}
              >
                <option>Select Transaction Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={transactionData.date}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </form>
        </div>
        <div className={styles.calendarContainer}>
          <Calendar
            onClickDay={handleDateChange}
            tileClassName={({ date }) => {
              if (
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
              ) {
                return styles.highlight;
              }
              return null;
            }}
          />
          <div className={styles.calendarText}>Choose the Date for Transaction</div>
        </div>
      </div>
      <div className={styles.recentTransactions}>
      {loading && <Spinner />}
        <h2>Transaction Details</h2>
        <div className={styles.cards}>
          {transactions.slice(-5).map((t) => (
            <div key={t._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t.title}</h3>
                <div className={styles.cardActions}>
                  <button
                    className={styles.UpdateBtn}
                    onClick={() => handleEdit(t._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className={styles.DeleteBtn}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Amount:</strong> &#8377;{t.amount}
                </p>
                <p><strong>Category:</strong>{t.category}</p>
                <p>
                  <strong>Type:</strong> {t.type}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export { Transaction };

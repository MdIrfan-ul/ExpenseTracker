
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Filler
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

import { fetchTransaction, fetchCategoryBreakdown, fetchAnalyticsData} from '../../features/transactionReducer';
import styles from './DashBoard.module.css';
import { Spinner } from '../../components/Spinner/Spinner';



// Register the necessary Chart.js components
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Filler
);

const DashBoard = () => {
    const dispatch = useDispatch();
    const { transactions = [], categoryBreakdown, analyticsData, loading, error} = useSelector(state => state.transaction);
    const [sortCriteria, setSortCriteria] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedTransactions, setSortedTransactions] = useState([]);



    useEffect(() => {
      
        dispatch(fetchTransaction());
        dispatch(fetchCategoryBreakdown());
        dispatch(fetchAnalyticsData());
    }, [dispatch]);

    useEffect(() => {
        const sortTransactions = () => {
            let sorted = [...transactions];
            sorted.sort((a, b) => {
                if (sortCriteria === 'date') {
                    return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
                } else {
                    if (sortOrder === 'asc') {
                        return a[sortCriteria] > b[sortCriteria] ? 1 : -1;
                    } else {
                        return a[sortCriteria] < b[sortCriteria] ? 1 : -1;
                    }
                }
            });
            setSortedTransactions(sorted);
        };
        sortTransactions();
    }, [transactions, sortCriteria, sortOrder]);

   

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    const handleOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const getSummary = () => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        return { income, expenses, balance: income - expenses };
    };

    const { income, expenses, balance } = getSummary();

    // Prepare data for line chart
    const lineData = {
        labels: transactions.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Income',
                data: transactions.filter(t => t.type === 'income').map(t => t.amount),
                borderColor: 'green',
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                fill: true,
            },
            {
                label: 'Expenses',
                data: transactions.filter(t => t.type === 'expense').map(t => t.amount),
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: true,
            }
        ]
    };

    // Prepare data for pie chart
    const categoryLabels = categoryBreakdown.map(item => item._id);
    const categoryAmounts = categoryBreakdown.map(item => item.totalAmount);

    const pieData = {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Category Breakdown',
                data: categoryAmounts,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Prepare data for bar chart
    const barLabels = analyticsData ? analyticsData.map(item => `Month ${item.month}`) : [];
    const incomeData = analyticsData ? analyticsData.map(item => item.income) : [];
    const expenseData = analyticsData ? analyticsData.map(item => item.expense) : [];

    const barData = {
        labels: barLabels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                borderColor: 'green',
                borderWidth: 1
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: 'red',
                borderWidth: 1
            }
        ]
    };

    

    return (
        <div className={styles.container}>
        <h1>Dashboard</h1>
        {loading && <Spinner/>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
            <div>
                <div className={styles.summary}>
                    <div>
                        <h2>Total Income</h2>
                        <p>&#8377;{income.toFixed(2)}</p>
                    </div>
                    <div>
                        <h2>Total Expenses</h2>
                        <p>&#8377;{expenses.toFixed(2)}</p>
                    </div>
                    <div>
                        <h2>Net Balance</h2>
                        <p>&#8377;{balance.toFixed(2)}</p>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <div>
                        <h2>Transaction Trends</h2>
                        <Line data={lineData} />
                    </div>
                    <div>
                        <h2>Category Breakdown</h2>
                        <Pie data={pieData} />
                    </div>
                    <div>
                        <h2>Monthly Analytics</h2>
                        <Bar data={barData} />
                    </div>
                </div>
                <div className={styles.recentTransactions}>
                        <h2>Recent Transactions</h2>
                        <div className={styles.filters}>
                            <h3>Sort By</h3>
                            <select onChange={handleSortChange} value={sortCriteria}>
                                <option value="date">Date</option>
                                <option value="title">Title</option>
                                <option value="amount">Amount</option>
                                <option value="category">Category</option>
                                <option value="type">Type</option>
                            </select>
                            <select onChange={handleOrderChange} value={sortOrder}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                               {sortedTransactions.slice(-5).map(t => (
                                    <tr key={t._id}>
                                        <td>{t.title}</td>
                                        <td>&#8377;{t.amount}</td>
                                        <td>{t.category}</td>
                                        <td>{t.type}</td>
                                        <td>{new Date(t.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        )}
    </div>
);
};

export { DashBoard};



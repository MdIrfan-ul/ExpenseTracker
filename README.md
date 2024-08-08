# ExpenseTracker

## Project Overview
This Expense Tracker application is designed to help users manage their personal finances. It allows users to track their income and expenses, categorize their transactions, set budgets, and receive alerts. The application also provides graphical reports and analytics for better financial planning.

## Site Overview
**Live**: [![ExpenseTracker](https://expnsetrakr.netlify.app/)]

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=js,html,css,react,redux,nodejs,express,mongodb,postman,git,github)](https://skillicons.dev)


## Technologies Used
- **Frontend**: React.js, Redux, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules
- **Charting**: Chart.js
- **Authentication**: Jwt token
- **Alerts**:Nodemailer

## Features:

- **User Authentication**: Secure login and registration for users using token based Authentication.
- **Expense and Income Tracking**: Add, edit, and delete income and expense transactions.
- **Category-wise Breakdown**: Categorize transactions for better insights.
- **Budget Setting and Alerts**: Set monthly budgets and receive alerts when limits are exceeded using nodemailer.
- **Graphical Reports and Analytics**: Visual representation of financial data through charts and graphs.

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- Node.js
- npm
- MongoDB

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/MdIrfan-ul/ExpenseTracker.git
   ```
2. Install NPM packages for frontend
    ```sh
    cd frontend
    npm install
    ```
3. Install NPM packages for backend
    ```sh
    cd backend
    npm install
    ```
4. Create a .env file in the backend folder and add your MongoDB URI and Firebase configuration details:

```sh
MONGO_URI=YOURMONGOURI
PORT=PORTNUMBER
JWT_SECRET_KEY=YOURSECRETKEY
EMAIL_USER=YOUREMAIL
EMAIL_PASS=YOURPASS
```
5. Run the server
```sh
cd backend
npm start
```
6. Run the frontend
```sh
cd frontend
npm start
```
___
## Folder Structure
```sh
ExpenseTracker/
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
├── backend/               # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── package.json
├── .gitignore
├── README.md
```
___

## Usage

- **Register/Login**: Create an account or log in with existing credentials.
- **Dashboard:** View summary of your financial status.
- **Add Transaction**: Add income or expense transactions.
- **Set Budget**: Set monthly budgets and receive alerts when limits are exceeded.
- **Reports**: View graphical reports and analytics for better financial insights.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

___

Developed with ❤️ by [Mohamed Irfanullah M]

___
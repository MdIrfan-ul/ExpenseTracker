import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

const sendBudgetAlertEmail = async (userEmail, category, budget, totalExpenses) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Budget Alert: Exceeded Budget',
        html: `<html>
        <head>
              <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    color:#fff;
                }
                .email-content {
                    background-color: rgba(255, 255, 255, 0.8); 
                    border-radius: 10px;
                    margin: 20px;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                }
                h1, p {
                    text-align: center;
                }
                img {
                    display: block;
                    margin: 0 auto;
                    width: 100%; 
                    height: 300px;
                    background-size:cover;
                    background-repeat:no-repeat;
                }
            </style>
        </head>
        <body>
            <div style="text-align: center;">
                <img src="https://m.media-amazon.com/images/I/61JfO8-6-FL._AC_UF1000,1000_QL80_.jpg" alt="Expense Tracker" />
            </div>
            <div class="email-content">
                <b>Dear User,</b>
                <p>Your spending in the "${category}" category has exceeded your budget.</p>
                <p>Budget: &#8377;${budget}</p>
                <p>Total Expenses: &#8377;${totalExpenses}</p>
                <p>Please review your spending and adjust your budget or expenses accordingly.</p>
                <p>Best regards,<br/>Your Expense Tracker Team</p>
            </div>
        </body>
        </html>

`

}
try {
    await transporter.sendMail(mailOptions);
} catch (error) {
    console.log('Error sending email:', error);
}
}

export {sendBudgetAlertEmail}
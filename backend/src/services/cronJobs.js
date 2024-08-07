import cron from "node-cron";

import { checkBudgetExceed } from "../models/budgets/budget.repository.js";
import { getUsers } from "../models/users/user.repository.js";


// Schedule the job to run every month on the first day at midnight
cron.schedule('0 0 * * 0', async () => {
    try {
        const users = await getUsers(); // Fetch all users

        for (const user of users) {
            // Check budget exceedance for each user
            await checkBudgetExceed(user._id, user.email);
        }

        console.log('Automated budget checks completed successfully.');
    } catch (error) {
        console.log('Error during automated budget checks:', error);
    }
});
import cron from 'node-cron';
import { updateEarnings } from './controllers/purchase.controller.js'; // Import the function you want to run

// Schedule the updateEarnings function to run once every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily updateEarnings job...');
  await updateEarnings();
});

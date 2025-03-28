import cron from 'node-cron';

// Schedule the updateEarnings function to run once every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily updateEarnings job...');
});

const cron = require('node-cron');
const axios = require('axios');


cron.schedule('*/1 * * * *', async () => {
    const baseURL = 'https://api.ezpick.co';

    try {
        const endpoint = '/cronjob/offTimeReminderSend';
        const url = baseURL + endpoint;

        // Make the HTTP request to the dynamic URL
        const offTimeReminderSend = await axios.get(url);

    } catch (error) {
        console.error('Error making the request:', error);
    }
    try {
        const endpoint = '/cronjob/startTimeReminderSend';
        const url = baseURL + endpoint;

        // Make an HTTP request to the desired route
        const startTimeReminderSend = await axios.get(url);


    } catch (error) {
        console.error('Error making the request:', error);
    }
});

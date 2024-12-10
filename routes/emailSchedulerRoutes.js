import express from 'express';
import EmailSchedulerController from '../controllers/emailSchedulerController.js'; // Import the default exported instance

const router = express.Router();

// Use the methods directly from the instance
router.post('/schedule', EmailSchedulerController.scheduleEmail);
router.delete('/cancel/:id', EmailSchedulerController.cancelEmail);
router.get('/scheduled', EmailSchedulerController.getScheduledEmails);

export default router;

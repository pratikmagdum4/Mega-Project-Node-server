import emailSchedulerService from '../services/emailSchedulerService.js';

function formatDate(inputDate) {
  // const date = new Date(inputDate);

  // // Extract year, month, day, hours, and minutes
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  // const day = String(date.getDate()).padStart(2, '0');
  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format the string as YYYY-MM-DDTHH:mm
  // return `${year}-${month}-${day}T${hours}:${minutes}`;
  return inputDate; // Removes the last 8 characters (".000Z")

}
class EmailSchedulerController {
  async scheduleEmail(req, res) {
    try {
      const { dateTime, recipient, description } = req.body;
      console.log("data got it ", req.body);

      if (!dateTime || !recipient || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const newDateTime = formatDate(dateTime)
      console.log("The new date is ",newDateTime)
      const id = Date.now().toString();
      await emailSchedulerService.scheduleEmail(id, newDateTime, recipient, description);

      res.status(201).json({
        message: 'Email scheduled successfully',
        id,
        scheduledFor: newDateTime,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to schedule email' });
    }
  }

  async cancelEmail(req, res) {
    try {
      const { id } = req.params;
      const cancelled = await emailSchedulerService.cancelScheduledEmail(id);

      if (cancelled) {
        res.json({ message: 'Scheduled email cancelled successfully' });
      } else {
        res.status(404).json({ error: 'Scheduled email not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to cancel scheduled email' });
    }
  }

  async getScheduledEmails(req, res) {
    try {
      const scheduledEmails = await emailSchedulerService.getScheduledEmails();
      res.json({ scheduledEmails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get scheduled emails' });
    }
  }
}

export default new EmailSchedulerController();
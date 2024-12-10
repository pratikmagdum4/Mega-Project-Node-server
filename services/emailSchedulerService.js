import cron from 'node-cron';
import transporter from '../config/emailConfig.js';

class EmailSchedulerService {
  scheduledJobs = new Map();

  scheduleEmail(id, dateTime, recipient, description) {
    const [date, time] = dateTime.split('T');
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');

    const cronExpression = `${minute} ${hour} ${day} ${month} *`;

    const job = cron.schedule(cronExpression, async () => {
      try {
        console.log("trying to send to email ")
        await this.sendEmail(recipient, description);
        this.scheduledJobs.delete(id);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    });

    this.scheduledJobs.set(id, job);
    return id;
  }

  async sendEmail(recipient, description) {
    const sub= "Task Remainder from your AI Journal";
    console.log("I mhere sending email this one ",recipient ,description)
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipient,
      subject: sub,
      text: description,
    };

    await transporter.sendMail(mailOptions);
  }

  cancelScheduledEmail(id) {
    const job = this.scheduledJobs.get(id);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(id);
      return true;
    }
    return false;
  }

  getScheduledEmails() {
    return Array.from(this.scheduledJobs.keys());
  }
}

export default new EmailSchedulerService();
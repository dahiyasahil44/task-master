const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("../models/Task");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Gmail
    pass: process.env.EMAIL_PASS   // Gmail App Password
  },
});

function startReminders() {
  // Run every minute (for testing)
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Checking tasks for reminders...");

    try {
      const now = new Date();
      const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000); // next 24h

      // Find tasks with due dates in next 24h
      const tasks = await Task.find({
        dueDate: { $lte: soon, $gte: now },
        status: { $ne: "completed" }, // don't remind completed tasks
      }).populate("assignedUsers", "name email"); // only get name + email

      console.log(`📌 Found ${tasks.length} tasks due soon`);

      for (const task of tasks) {
        for (const user of task.assignedUsers) {
          if (!user.email) continue;

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "⏰ Task Deadline Reminder",
            text: `Hello ${user.name},\n\nYour task "${task.title}" is due on ${task.dueDate.toDateString()}.\n\nPlease make sure to complete it on time.\n\n- Task Manager`,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log(`📧 Reminder sent to ${user.email} for task: ${task.title}`);
          } catch (err) {
            console.error("❌ Email send error:", err.message);
          }
        }
      }
    } catch (err) {
      console.error("Reminder error:", err.message);
    }
  });
}

module.exports = startReminders;

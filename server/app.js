require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// initialize app
const app = express();
// middlewares
app.use(cors());
app.use(express.json());

// connect to database
connectDB();

// start the reminder service
const startReminders = require("./config/startReminders");
startReminders();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// protected route example
const auth = require('./middlewares/auth');
const role = require('./middlewares/role');

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you are authenticated!` });
});

app.get('/api/admin', auth, role(['admin']), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.name}` });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
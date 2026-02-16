

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');


dotenv.config();
const app = express();

app.use(express.json());//used to parse json bodies
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});
  
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);



app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

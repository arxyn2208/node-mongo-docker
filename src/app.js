

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
const app = express();

app.use(express.json());//used to parse json bodies


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);


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

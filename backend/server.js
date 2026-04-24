const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB before starting server
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174', // in case the port bumped
    'http://127.0.0.1:5174'
  ],
  credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// Save io to app to access it in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/scan', require('./routes/scanRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Attendly AI server running on port ${PORT}`);
});

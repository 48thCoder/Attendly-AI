# 🎓 Attendly AI - Smart Attendance System

A MERN-stack smart attendance system featuring real-time facial recognition (face-api.js) and Gemini AI-driven anomaly detection to eliminate proxy attendance and automate student analytics.

## ✨ Features

- **👤 Real-time Facial Recognition**: Uses face-api.js for accurate face detection and recognition
- **🤖 AI-Powered Anomaly Detection**: Integrates Google Gemini AI to detect suspicious attendance patterns
- **🛡️ Proxy Attendance Prevention**: Eliminates buddy punching through biometric verification
- **📹 Live Attendance Scanning**: Real-time camera-based attendance marking
- **👨‍🏫 Student & Teacher Dashboards**: Role-based interfaces for different users
- **📊 Analytics Dashboard**: Comprehensive attendance analytics with visual charts
- **⚡ Real-time Updates**: Socket.io integration for live data synchronization
- **📱 PWA Support**: Progressive Web App capabilities for offline access
- **📥 Export Records**: Download attendance records as CSV files
- **🎨 Responsive Design**: Modern UI built with TailwindCSS and Framer Motion

## 🛠️ Tech Stack

### 🔧 Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Generative AI** - AI-powered anomaly detection
- **json2csv** - CSV export functionality

### ⚛️ Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **face-api.js** - Face recognition
- **Socket.io Client** - Real-time updates
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client

## Project Structure

```
Attendly-AI/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth, error handling)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   ├── seed.js          # Database seeding
│   └── reset.js         # Database reset
├── frontend/
│   ├── public/
│   │   └── models/      # Face-api.js models
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── face-api.js/ # Face recognition utilities
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── index.html
└── README.md
```

## 🚀 Installation

### 📋 Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

### 🔙 Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendly-ai
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 🔜 Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ Database Seeding

To seed the database with sample data:

```bash
cd backend
npm run seed
```

To reset the database:

```bash
npm run reset
```

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### 📋 Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/session/:id` - Get attendance session
- `GET /api/attendance/history` - Get attendance history

### 👨‍🎓 Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### 📝 Records
- `GET /api/records` - Get attendance records
- `GET /api/records/export` - Export records as CSV

### 📷 Scan
- `POST /api/scan/start` - Start live scan session
- `POST /api/scan/stop` - Stop scan session
- `POST /api/scan/verify` - Verify face

### ⚙️ Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update settings

### 📈 Analytics
- `GET /api/analytics/overview` - Get attendance overview
- `GET /api/analytics/trends` - Get attendance trends

## 📄 Pages & Features

### 🔑 Authentication
- **Login**: User authentication with JWT
- **Register**: New user registration with role selection (Teacher/Student)

### 👨‍🏫 Teacher Dashboard
- Overview of attendance statistics
- Quick access to main features
- Recent activity feed

### 👨‍🎓 Student Dashboard
- Personal attendance overview
- Attendance history
- Profile management

### 📹 Live Scan
- Real-time camera feed
- Face detection and recognition
- Automatic attendance marking
- Anomaly detection alerts

### 📋 Records
- View all attendance records
- Filter by date, student, or status
- Export to CSV

### 👥 Students
- Manage student database
- Add/edit/delete students
- Register facial data

### 📊 Attendance Analytics
- Visual charts and graphs
- Attendance trends
- Anomaly detection reports
- Export analytics data

### ⚙️ Settings
- System configuration
- API key management
- Attendance parameters
- Notification settings

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## 💡 Usage

1. **👨‍🏫 Register as a Teacher**: Create an account with teacher role
2. **➕ Add Students**: Register students and capture their facial data
3. **📹 Start Live Scan**: Begin an attendance session with camera
4. **✅ Mark Attendance**: Students are automatically marked when their face is recognized
5. **📊 View Analytics**: Monitor attendance patterns and detect anomalies
6. **📥 Export Records**: Download attendance data for reporting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- face-api.js for facial recognition capabilities
- Google Gemini AI for anomaly detection
- The open-source community for the amazing tools and libraries

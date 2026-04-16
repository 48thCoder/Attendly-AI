
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



const mockStudents = [
  { id: 1, name: 'Aarav Mehta', roll: 'CS-2024-001', email: 'aarav@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 92, status: 'active' },
  { id: 2, name: 'Priya Sharma', roll: 'CS-2024-002', email: 'priya@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 78, status: 'active' },
  { id: 3, name: 'Rohan Kapoor', roll: 'CS-2024-003', email: 'rohan@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 65, status: 'active' },
  { id: 4, name: 'Sneha Patel', roll: 'EC-2024-001', email: 'sneha@attendly.ai', department: 'Electronics', avatar: null, attendancePct: 88, status: 'active' },
  { id: 5, name: 'Vikram Singh', roll: 'EC-2024-002', email: 'vikram@attendly.ai', department: 'Electronics', avatar: null, attendancePct: 74, status: 'active' },
  { id: 6, name: 'Ananya Gupta', roll: 'ME-2024-001', email: 'ananya@attendly.ai', department: 'Mechanical', avatar: null, attendancePct: 96, status: 'active' },
  { id: 7, name: 'Kiran Nair', roll: 'ME-2024-002', email: 'kiran@attendly.ai', department: 'Mechanical', avatar: null, attendancePct: 58, status: 'warning' },
  { id: 8, name: 'Raj Malhotra', roll: 'CS-2024-004', email: 'raj@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 82, status: 'active' },
  { id: 9, name: 'Divya Iyer', roll: 'CS-2024-005', email: 'divya@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 91, status: 'active' },
  { id: 10, name: 'Arjun Reddy', roll: 'EC-2024-003', email: 'arjun@attendly.ai', department: 'Electronics', avatar: null, attendancePct: 45, status: 'critical' },
  { id: 11, name: 'Meera Desai', roll: 'ME-2024-003', email: 'meera@attendly.ai', department: 'Mechanical', avatar: null, attendancePct: 88, status: 'active' },
  { id: 12, name: 'Nikhil Joshi', roll: 'CS-2024-006', email: 'nikhil@attendly.ai', department: 'Computer Science', avatar: null, attendancePct: 70, status: 'active' },
];

const mockRecentScans = [
  { id: 1, name: 'Aarav Mehta', roll: 'CS-001', time: new Date().toISOString(), confidence: 98.2, status: 'present' },
  { id: 2, name: 'Priya Sharma', roll: 'CS-002', time: new Date(Date.now() - 3 * 60000).toISOString(), confidence: 95.7, status: 'present' },
  { id: 3, name: 'Rohan Kapoor', roll: 'CS-003', time: null, confidence: 0, status: 'absent' },
  { id: 4, name: 'Sneha Patel', roll: 'EC-001', time: new Date(Date.now() - 7 * 60000).toISOString(), confidence: 91.4, status: 'present' },
  { id: 5, name: 'Vikram Singh', roll: 'EC-002', time: new Date(Date.now() - 12 * 60000).toISOString(), confidence: 88.9, status: 'present' },
  { id: 6, name: 'Ananya Gupta', roll: 'ME-001', time: null, confidence: 0, status: 'absent' },
  { id: 7, name: 'Raj Malhotra', roll: 'CS-004', time: new Date(Date.now() - 18 * 60000).toISOString(), confidence: 97.1, status: 'present' },
  { id: 8, name: 'Divya Iyer', roll: 'CS-005', time: new Date(Date.now() - 22 * 60000).toISOString(), confidence: 93.6, status: 'present' },
];

const mockWeeklyStats = [
  { name: 'Mon', present: 45, absent: 5 },
  { name: 'Tue', present: 48, absent: 2 },
  { name: 'Wed', present: 40, absent: 10 },
  { name: 'Thu', present: 42, absent: 8 },
  { name: 'Fri', present: 49, absent: 1 },
];

const mockRecords = [
  { id: 1, date: '2024-04-14', class: 'CS-301 Algorithms', present: 42, absent: 8, rate: 84 },
  { id: 2, date: '2024-04-13', class: 'CS-302 Networks', present: 47, absent: 3, rate: 94 },
  { id: 3, date: '2024-04-12', class: 'CS-303 DBMS', present: 38, absent: 12, rate: 76 },
  { id: 4, date: '2024-04-11', class: 'CS-304 OS', present: 44, absent: 6, rate: 88 },
  { id: 5, date: '2024-04-10', class: 'CS-301 Algorithms', present: 49, absent: 1, rate: 98 },
  { id: 6, date: '2024-04-09', class: 'CS-302 Networks', present: 41, absent: 9, rate: 82 },
  { id: 7, date: '2024-04-08', class: 'CS-303 DBMS', present: 45, absent: 5, rate: 90 },
  { id: 8, date: '2024-04-07', class: 'CS-304 OS', present: 36, absent: 14, rate: 72 },
];

const mockStudentAttendance = {
  overallPct: 78,
  subjects: [
    { name: 'Algorithms', attended: 18, total: 22, pct: 82 },
    { name: 'Networks', attended: 20, total: 22, pct: 91 },
    { name: 'DBMS', attended: 16, total: 22, pct: 73 },
    { name: 'Operating Systems', attended: 14, total: 22, pct: 64 },
    { name: 'Machine Learning', attended: 21, total: 22, pct: 95 },
  ],
  calendar: {
    '2024-04-01': 'present', '2024-04-02': 'present', '2024-04-03': 'absent',
    '2024-04-04': 'present', '2024-04-05': 'present', '2024-04-08': 'present',
    '2024-04-09': 'absent', '2024-04-10': 'present', '2024-04-11': 'present',
    '2024-04-12': 'present', '2024-04-13': 'absent', '2024-04-14': 'present',
  }
};



export const authAPI = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('teacher') || email === 'teacher@attendly.ai') {
          resolve({ data: { token: 'mock-jwt-teacher-' + Date.now(), user: { id: 1, name: 'Dr. Aryan Mehta', role: 'teacher', email, avatar: null } } });
        } else if (email.includes('student') || email === 'student@attendly.ai') {
          resolve({ data: { token: 'mock-jwt-student-' + Date.now(), user: { id: 2, name: 'Aarav Mehta', role: 'student', email, roll: 'CS-2024-001', avatar: null } } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 900);
    });
  },
};

export const attendanceAPI = {
  getToday: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: {
        present: 42, absent: 8, total: 50, avgConfidence: 94.5,
        recent: mockRecentScans
      }
    }), 600));
  },
  getWeeklyStats: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockWeeklyStats }), 600));
  },
  getStudentAttendance: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockStudentAttendance }), 600));
  },
};

export const studentsAPI = {
  getAll: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockStudents }), 700));
  },
  register: async (formData) => {
    return new Promise((resolve) => setTimeout(() => resolve({
      data: { success: true, message: 'Student registered successfully', student: { id: Date.now(), ...formData } }
    }), 1200));
  },
  delete: async (id) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500));
  }
};

export const recordsAPI = {
  getRecords: async (filter = 'week') => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockRecords }), 600));
  },
  exportCSV: async (filter) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: 'csv-export-data' }), 800));
  }
};

export const scanAPI = {
  recognize: async (cameraId) => {
    const randomStudents = mockStudents.slice(0, 5);
    const random = randomStudents[Math.floor(Math.random() * randomStudents.length)];
    const recognized = Math.random() > 0.25;
    return new Promise((resolve) => setTimeout(() => resolve({
      data: recognized
        ? { recognized: true, student: random, confidence: (85 + Math.random() * 14).toFixed(1), time: new Date().toISOString() }
        : { recognized: false, confidence: (30 + Math.random() * 30).toFixed(1) }
    }), 1500 + Math.random() * 1000));
  }
};

export const settingsAPI = {
  get: async () => new Promise((resolve) => setTimeout(() => resolve({ data: {
    recognitionThreshold: 80,
    autoMarkTime: '09:30',
    cameraResolution: '1080p',
    notifications: true,
    theme: 'dark',
  }}), 300)),
  save: async (settings) => new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500)),
};

export default api;

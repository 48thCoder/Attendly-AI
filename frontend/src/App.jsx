
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { LiveScan } from './pages/LiveScan';
import { Records } from './pages/Records';
import { Students } from './pages/Students';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile';
import { AttendanceAnalytics } from './pages/AttendanceAnalytics';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { CustomCursor } from './components/CustomCursor';
import { AnimatedBackground } from './components/AnimatedBackground';

const NotificationWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#0e1726',
          color: '#f1f5f9',
          border: '1px solid rgba(0,255,231,0.25)',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#00ffe7', secondary: '#0e1726' } },
        error:   { iconTheme: { primary: '#ff4d6d', secondary: '#0e1726' } },
      }}
    />
  );
};

function App() {
  return (
    <>
      <CustomCursor />
      <AnimatedBackground />

      <AuthProvider>
        <Router>
          <NotificationWrapper />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
              } />
              <Route path="scan" element={
                <ProtectedRoute allowedRoles={['teacher']}><LiveScan /></ProtectedRoute>
              } />
              <Route path="records" element={
                <ProtectedRoute allowedRoles={['teacher']}><Records /></ProtectedRoute>
              } />
              <Route path="students" element={
                <ProtectedRoute allowedRoles={['teacher']}><Students /></ProtectedRoute>
              } />
              <Route path="students/:id" element={
                <ProtectedRoute allowedRoles={['teacher']}><StudentProfile /></ProtectedRoute>
              } />
              <Route path="students/register" element={
                <ProtectedRoute allowedRoles={['teacher']}><Register /></ProtectedRoute>
              } />
              <Route path="my-attendance" element={
                <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute allowedRoles={['student']}><AttendanceAnalytics /></ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;

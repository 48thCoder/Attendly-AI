import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  changePassword: (currentPassword, newPassword) =>
    api.post("/auth/change-password", { currentPassword, newPassword }),
};

export const attendanceAPI = {
  getToday: () => api.get("/attendance/today"),
  getWeeklyStats: () => api.get("/attendance/weekly"),
  getStudentAttendance: (userId = "me") =>
    api.get(`/attendance/student/${userId}`),
  markAttendance: (data) => api.post("/attendance/check-in", data),
};

export const studentsAPI = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  register: (formData) => api.post("/students/register", formData),
  delete: (id) => api.delete(`/students/${id}`),
};

export const recordsAPI = {
  getRecords: (filter = "week", from, to) => {
    let url = `/records?filter=${filter}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    return api.get(url);
  },
  exportCSV: (filter = "week", from, to) => {
    let url = `/records/export?filter=${filter}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    return api.get(url, { responseType: "blob" });
  },
};

export const scanAPI = {
  recognize: (faceDescriptor) =>
    api.post("/scan/recognize", { faceDescriptor }),
};

export const settingsAPI = {
  get: () => api.get("/settings"),
  save: (settings) => api.put("/settings", settings),
};

export const analyticsAPI = {
  getReport: () => api.get("/analytics/report"),
  predict: (userId) => api.get(`/analytics/predict/${userId}`),
};

export default api;

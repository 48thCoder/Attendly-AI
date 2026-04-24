import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  FileText,
  Users,
  Settings,
  LogOut,
  UserCircle,
  Menu,
  X,
  ChevronRight,
  Cpu,
  BookOpen,
  LineChart,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const teacherNav = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Live Scanner", path: "/scan", icon: Camera },
  { name: "Records", path: "/records", icon: FileText },
  { name: "Students", path: "/students", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

const studentNav = [
  { name: "My Dashboard", path: "/my-attendance", icon: BookOpen },
  { name: "Planning & Insights", path: "/analytics", icon: LineChart },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  const teacherNotifications = [
    {
      id: 1,
      title: "Low Attendance Alert",
      desc: "3 students in CS-301 are below 75%",
      time: "10m ago",
      unread: true,
      type: "warning",
    },
    {
      id: 2,
      title: "AI Model Update",
      desc: "Face recognition engine updated to v2.4",
      time: "1h ago",
      unread: true,
      type: "info",
    },
    {
      id: 3,
      title: "Export Ready",
      desc: "Monthly report for March is ready",
      time: "1d ago",
      unread: false,
      type: "success",
    },
  ];

  const studentNotifications = [
    {
      id: 1,
      title: "Attendance Marked",
      desc: "You were marked Present in Algorithms",
      time: "5m ago",
      unread: true,
      type: "success",
    },
    {
      id: 2,
      title: "Attendance Warning",
      desc: "Your DBMS attendance dropped to 73%",
      time: "2h ago",
      unread: true,
      type: "warning",
    },
    {
      id: 3,
      title: "Badge Earned! 🏆",
      desc: 'You earned the "Perfect Week" badge',
      time: "1d ago",
      unread: false,
      type: "success",
    },
  ];

  const [notifications, setNotifications] = useState(
    user?.role === "teacher" ? teacherNotifications : studentNotifications,
  );

  useEffect(() => {
    import("socket.io-client").then(({ io }) => {
      const socketUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '') 
        : 'http://localhost:5000';
      const socket = io(socketUrl);

      socket.on('new_notification', (data) => {
        // Only show relevant notifications
        if (data.recipientRole === user?.role) {
          if (data.recipientRole === 'student' && data.recipientId !== user?.id) {
            return;
          }
          setNotifications(prev => [data, ...prev]);
        }
      });

      return () => socket.disconnect();
    });
  }, [user]);

  const navItems = user?.role === "teacher" ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-surfaceLight
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-surfaceLight flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Cpu size={16} className="text-primary" />
            </div>
            <h1 className="text-lg font-playfair font-bold">
              <span className="text-primary">Attendly</span>
              <span className="text-white"> AI</span>
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-surfaceLight/50 flex-shrink-0">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${user?.role === "teacher" ? "bg-primary/10 text-primary border-primary/30" : "bg-blue-500/10 text-blue-400 border-blue-400/30"}`}
          >
            {user?.role === "teacher"
              ? "👨‍🏫 Teacher Portal"
              : "👨‍🎓 Student Portal"}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 group text-sm
                ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-[3px] border-primary pl-[calc(0.875rem-1px)]"
                    : "text-gray-400 hover:text-white hover:bg-surfaceLight border-l-[3px] border-transparent"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-primary/50"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-surfaceLight flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-playfair text-xs font-bold border border-primary/20 flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 rounded-xl"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-surfaceLight bg-surface/60 backdrop-blur-md flex-shrink-0 relative z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 mr-2 text-gray-400 hover:text-white lg:hidden rounded-lg hover:bg-surfaceLight transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              System Online
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto relative">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-surfaceLight transition-colors"
              >
                <Bell size={18} />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-4 right-0 w-80 md:w-96 bg-background border border-surfaceLight shadow-2xl z-50 overflow-hidden rounded-xl"
                    style={{ transformOrigin: "top right" }}
                  >
                    <div className="p-3 border-b border-surfaceLight flex justify-between items-center bg-surface/50">
                      <h4 className="text-sm font-semibold text-white">
                        Notifications
                      </h4>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() =>
                          setNotifications(
                            notifications.map((n) => ({ ...n, unread: false })),
                          )
                        }
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {notifications.map((note) => (
                        <div
                          key={note.id}
                          className={`p-3 border-b border-surfaceLight/50 hover:bg-surfaceLight/30 transition-colors ${note.unread ? "bg-primary/5" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${note.type === "warning" ? "bg-amber-400" : note.type === "success" ? "bg-emerald-400" : "bg-primary"} ${note.unread ? "animate-pulse" : "opacity-0"}`}
                            />
                            <div>
                              <p
                                className={`text-sm font-medium ${note.unread ? "text-white" : "text-gray-300"}`}
                              >
                                {note.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {note.desc}
                              </p>
                              <p className="text-[10px] text-gray-600 mt-1">
                                {note.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:block text-right ml-2 border-l border-surfaceLight pl-4">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role === 'teacher' ? user?.department : user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-playfair text-xs font-bold border border-primary/20 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {user?.mustChangePassword && location.pathname !== '/settings' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white text-left">Action Required: Update Password</h5>
                    <p className="text-xs text-gray-400 mt-0.5 text-left">You are using a temporary password. Please update it for better security.</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/settings')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-background font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
                >
                  Change Now
                </button>
              </div>
            </motion.div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

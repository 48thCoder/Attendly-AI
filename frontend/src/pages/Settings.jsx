import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell, Camera, Sliders, Clock, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { settingsAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
      value ? 'bg-primary' : 'bg-surfaceLight'
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
        value ? 'translate-x-7' : 'translate-x-1'
      }`}
    />
  </button>
);

const Section = ({ icon: Icon, iconClass, title, delay, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-surfaceLight">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconClass}`}>
        <Icon size={17} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

export const Settings = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    settingsAPI.get()
      .then(res => setSettings(res.data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.save(settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="md" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-orbitron font-bold text-white"
          >
            Settings
          </motion.h2>
          <p className="text-sm text-gray-400 mt-1">
            {isTeacher ? 'System & personal preferences' : 'Personal preferences'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          <Save size={15} className={saving ? 'animate-spin' : ''} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-4">
        <Section
          icon={UserCircle}
          iconClass="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
          title="Account Profile"
          delay={0.05}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1 group-hover:border-primary transition-all duration-300">
                <div className="w-full h-full rounded-full bg-surfaceLight overflow-hidden border border-surfaceLight flex items-center justify-center">
                  {user?.avatar || settings?.avatar ? (
                    <img
                      src={user?.avatar || settings?.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle size={40} className="text-gray-600" />
                  )}
                </div>
              </div>
              <label 
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300"
              >
                <Camera size={20} className="text-white" />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => update('avatar', reader.result);
                    reader.readAsDataURL(file);
                    toast.success('Preview updated. Click Save to apply.');
                  }
                }}
              />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold">{user?.displayName || user?.name}</h4>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{user?.role} Account</p>
              <p className="text-[10px] text-primary/70 mt-2 font-mono">ID: {user?.id || 'AUTH_REDACTED'}</p>
            </div>
          </div>
        </Section>

        {isTeacher && (
          <>
            <Section
              icon={Sliders}
              iconClass="bg-primary/10 border border-primary/20 text-primary"
              title="AI Recognition"
              delay={0.1}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Recognition Threshold</label>
                  <span className="text-primary font-orbitron font-bold text-sm">
                    {settings.recognitionThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={settings.recognitionThreshold}
                  onChange={e => update('recognitionThreshold', Number(e.target.value))}
                  className="w-full h-2 bg-surfaceLight rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1.5">
                  <span>50% (Lenient)</span>
                  <span>99% (Strict)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Faces must match with at least {settings.recognitionThreshold}% confidence.
                </p>
              </div>
            </Section>

            <Section
              icon={Clock}
              iconClass="bg-amber-400/10 border border-amber-400/20 text-amber-400"
              title="Attendance Rules"
              delay={0.2}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto Mark Absent After
                </label>
                <input
                  type="time"
                  value={settings.autoMarkTime}
                  onChange={e => update('autoMarkTime', e.target.value)}
                  className="input-field w-48"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Students not scanned by this time will be auto-marked absent.
                </p>
              </div>
            </Section>

            <Section
              icon={Camera}
              iconClass="bg-blue-400/10 border border-blue-400/20 text-blue-400"
              title="Camera Settings"
              delay={0.3}
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Resolution
                </label>
                <select
                  value={settings.cameraResolution}
                  onChange={e => update('cameraResolution', e.target.value)}
                  className="input-field w-full max-w-xs"
                >
                  {['480p', '720p', '1080p', '4K'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Higher resolution improves accuracy but requires more processing.
                </p>
              </div>
            </Section>
          </>
        )}

        <Section
          icon={SettingsIcon}
          iconClass="bg-purple-400/10 border border-purple-400/20 text-purple-400"
          title="Preferences"
          delay={isTeacher ? 0.4 : 0.1}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Push Notifications</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isTeacher
                    ? 'Alerts for low attendance and system events'
                    : 'Get notified when your attendance is marked'}
                </p>
              </div>
              <Toggle
                value={settings.notifications}
                onChange={v => update('notifications', v)}
              />
            </div>

            {!isTeacher && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Weekly Email Summary</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive a weekly digest of your attendance stats
                  </p>
                </div>
                <Toggle
                  value={settings.emailDigest ?? true}
                  onChange={v => update('emailDigest', v)}
                />
              </div>
            )}

            </div>
        </Section>

        {!isTeacher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 border border-primary/10"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Bell size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">Account Settings</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  To update your name, email, or password, please contact your teacher or institution admin.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

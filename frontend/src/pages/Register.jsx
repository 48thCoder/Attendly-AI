import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, UserCheck, ArrowLeft, User, Mail, Hash, Building, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { studentsAPI } from '../services/api';
import toast from 'react-hot-toast';
import * as faceapi from 'face-api.js';
import { loadModels } from '../face-api.js/faceApiLoader';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical'];

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    let stream = null;
    const init = async () => {
      try {
        await loadModels();
        setModelsLoaded(true);
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        toast.error('AI Camera Initialization Failed.');
      }
    };

    init();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !modelsLoaded) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      toast.error("No face detected! Please look directly at the camera.");
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const previewUrl = canvas.toDataURL('image/jpeg');
        onCapture(blob, previewUrl, Array.from(detection.descriptor));
        toast.success('AI Face Biometrics Captured!');
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="relative aspect-video">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      
      {streamActive && modelsLoaded && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-60 border-2 border-primary border-dashed rounded-[2rem] relative">
              <div className="absolute inset-0 border border-primary/20 rounded-[2rem] animate-pulse" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-background px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                AI Alignment
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
            <button
              type="button"
              onClick={capture}
              className="btn-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera size={16} /> Enroll Student Biometrics
            </button>
          </div>
        </>
      )}
      
      {(!streamActive || !modelsLoaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400">
            {!modelsLoaded ? "Initializing AI Engine..." : "Activating Camera..."}
          </p>
        </div>
      )}
    </div>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', roll: '', email: '', department: 'Computer Science' });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.roll.trim()) e.roll = 'Roll number is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!photo || !fingerprint) e.photo = 'AI face capture is mandatory';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await studentsAPI.register({ ...form, photo, fingerprint });
      toast.success(`Student ${form.name} registered with Biometrics! 🎉`);
      navigate('/students');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const inputClass = (field) =>
    `input-field ${errors[field] ? 'border-red-500/60 focus:ring-red-500 focus:border-red-500' : ''}`;

  return (
    <div className="page-container max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate('/students')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-playfair font-bold text-white">
            Biometric Enrollment
          </motion.h2>
          <p className="text-sm text-gray-400 mt-0.5 ml-0">Mandatory AI face scan for secure attendance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Camera size={16} className="text-primary" /> AI Face Profile
          </h3>

          <div className="relative overflow-hidden rounded-xl border-2 border-surfaceLight bg-background/50">
              {photoPreview ? (
                <div className="p-6 text-center space-y-4">
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="Captured" className="w-48 h-48 rounded-2xl object-cover mx-auto border-4 border-primary/20 shadow-xl shadow-primary/5" />
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-background">
                      <UserCheck size={14} />
                    </div>
                  </div>
                  <div>
                    <p className="text-primary font-bold text-sm">Face Scan Successful ✓</p>
                    <p className="text-xs text-gray-500 mt-1">Biometric vector generated & attached</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setPhoto(null); setPhotoPreview(null); setFingerprint(null); }}
                    className="btn-secondary w-full justify-center gap-2"
                  >
                    <RefreshCw size={14} /> Reset & Retake
                  </button>
                </div>
              ) : (
                <WebcamCapture onCapture={(blob, preview, descriptor) => {
                    setPhoto(blob);
                    setPhotoPreview(preview);
                    setFingerprint(descriptor);
                    setErrors(prev => ({ ...prev, photo: null }));
                }} />
              )}
          </div>
          {errors.photo && <p className="text-red-400 text-xs mt-2">{errors.photo}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <User size={16} className="text-primary" /> Student Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={form.name} onChange={update('name')} className={`${inputClass('name')} pl-10`} placeholder="e.g. Aarav Mehta" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Roll Number *</label>
              <div className="relative">
                <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={form.roll} onChange={update('roll')} className={`${inputClass('roll')} pl-10`} placeholder="e.g. CS-2024-001" />
              </div>
              {errors.roll && <p className="text-red-400 text-xs mt-1">{errors.roll}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} onChange={update('email')} className={`${inputClass('email')} pl-10`} placeholder="student@attendly.ai" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Department *</label>
              <div className="relative">
                <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <select value={form.department} onChange={update('department')} className="input-field pl-10">
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/students')} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:transform-none">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              <><UserCheck size={16} /> Register Student</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: [true, 'Role is required']
  },
  roll: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  faceDescriptor: {
    type: [Number]
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', userSchema);

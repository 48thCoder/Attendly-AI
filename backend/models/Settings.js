const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  recognitionThreshold: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  autoMarkTime: {
    type: String,
    default: '09:30'
  },
  cameraResolution: {
    type: String,
    enum: ['480p', '720p', '1080p', '4K'],
    default: '1080p'
  },
  notifications: {
    type: Boolean,
    default: true
  },
  emailDigest: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);

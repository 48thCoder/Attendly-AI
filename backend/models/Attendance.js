const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'late', 'absent'],
    default: 'present'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  markedBy: {
    type: String,
    enum: ['ai', 'manual'],
    default: 'ai'
  }
}, {
  timestamps: true
});

attendanceSchema.index({ userId: 1, timestamp: -1 });
attendanceSchema.index({ sessionId: 1 });
attendanceSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

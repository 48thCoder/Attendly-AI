const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

sessionSchema.index({ teacherId: 1, date: -1 });
sessionSchema.index({ date: -1 });

module.exports = mongoose.model('Session', sessionSchema);

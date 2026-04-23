const Settings = require('../models/Settings');

const defaultSettings = {
  recognitionThreshold: 80,
  autoMarkTime: '09:30',
  cameraResolution: '1080p',
  notifications: true,
  emailDigest: true,
  theme: 'dark',
  avatar: ''
};

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = await Settings.create({
        userId: req.user.id,
        ...defaultSettings
      });
    }

    res.json({
      recognitionThreshold: settings.recognitionThreshold,
      autoMarkTime: settings.autoMarkTime,
      cameraResolution: settings.cameraResolution,
      notifications: settings.notifications,
      emailDigest: settings.emailDigest,
      theme: settings.theme,
      avatar: settings.avatar
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      'recognitionThreshold', 'autoMarkTime', 'cameraResolution',
      'notifications', 'emailDigest', 'theme', 'avatar'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    // Sync avatar with User model if updated
    if (req.body.avatar !== undefined) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, { avatar: req.body.avatar });
    }

    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update Settings Error:', error);
    next(error);
  }
};

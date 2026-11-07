const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    return sendSuccess(res, { notifications, unreadCount });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { isRead: true } }
    );
    return sendSuccess(res, null, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
});

router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
});

module.exports = router;


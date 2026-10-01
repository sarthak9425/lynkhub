const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  shortLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShortLink',
    required: true,
    index: true
  },
  clickedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  hashedIp: {
    type: String
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Click', ClickSchema);

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    required: true
  },
  userPhoto: {
    photoID: {
      type: String
    },
    photoURL: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);

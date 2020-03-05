const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   GET api/profile/:userId
// @desc    Get profile by userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    return res.json(profile);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   POST api/profile
// @desc    Create / Update profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('firstName', 'Пожалуйста, укажите ваше имя')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      secondName,
      dateOfBirth,
      phoneNumber,
      userPhoto
    } = req.body;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ msg: 'Профиль не найден' });
      }

      if (firstName) profile.firstName = firstName;
      if (secondName) profile.secondName = secondName;
      if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
      if (phoneNumber) profile.phoneNumber = phoneNumber;
      if (userPhoto) profile.userPhoto = userPhoto;

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

module.exports = router;

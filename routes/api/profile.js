const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const config = require('config');

const Search = require('../../models/Search');
const Proposal = require('../../models/Proposal');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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
// @desc    Update profile
// @access  Private
router.post(
  '/',
  [auth, [check('firstName', 'Пожалуйста, укажите ваше имя').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      secondName,
      dateOfBirth,
      phoneNumber
      // photoURL
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
      // if (photoURL) profile.userPhoto.photoURL = photoURL;

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   POST api/profile/photo
// @desc    Update profile photo data
// @access  Private
router.post('/photo', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userPhoto } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    if (userPhoto) {
      if (profile.userPhoto.photoID !== '') {
        const public_id = profile.userPhoto.photoID;

        cloudinary.config({
          cloud_name: config.get('cloudinary_cloud_name'),
          api_key: config.get('cloudinary_api_key'),
          api_secret: config.get('cloudinary_api_secret')
        });

        await cloudinary.v2.uploader.destroy(public_id, {
          invalidate: true
        });
      }
      profile.userPhoto = userPhoto;
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   DELETE api/profile/photo
// @desc    Delete profile photo data
// @access  Private
router.delete('/photo', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    const public_id = profile.userPhoto.photoID;

    cloudinary.config({
      cloud_name: config.get('cloudinary_cloud_name'),
      api_key: config.get('cloudinary_api_key'),
      api_secret: config.get('cloudinary_api_secret')
    });

    await cloudinary.v2.uploader.destroy(public_id, {
      invalidate: true
    });

    profile.userPhoto = {
      photoID: '',
      photoURL: ''
    };

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Delete user search criteria
    await Search.deleteMany({ user: req.user.id });

    // Delete user proposals
    await Proposal.deleteMany({ user: req.user.id });

    // Delete user profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Delete user account
    await User.findByIdAndRemove(req.user.id);

    return res.json({ msg: 'Профиль и аккаунт пользователя удалены' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   POST api/profile/favorites
// @desc    Add proposal to user favorites
// @access  Private
router.post('/favorites', auth, async (req, res) => {
  // console.log(req);
  const { proposalId } = req.body;
  //console.log(proposalId);

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    if (profile.favorites.includes(proposalId)) {
      return res.status(400).json({ msg: 'Объект уже добавлен в избранное' });
    } else {
      profile.favorites.push(proposalId);
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   DELETE api/profile/favorites/:proposalId
// @desc    Remove proposal from user favorites
// @access  Private
router.delete('/favorites/:proposalId', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    const removeIndex = profile.favorites.indexOf(req.params.proposalId);

    if (removeIndex === -1) {
      return res
        .status(404)
        .json({ msg: 'Предложение не найдено в избранном' });
    } else {
      profile.favorites.splice(removeIndex, 1);
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

module.exports = router;

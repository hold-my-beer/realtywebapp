const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('users'));

// @route   POST api/users
// @desc    Register user
// @access  Public

router.post(
  '/',
  [
    check('firstName', 'Пожалуйста, укажите ваше имя')
      .not()
      .isEmpty(),
    check('email', 'Введенные данные не являются email').isEmail(),
    check('password', 'Пароль должен содержать не менее 6 символов').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, secondName, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email или пароль указаны неверно' }] });
      }

      user = new User({ email, password });

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let profile = new Profile({
        user: user.id,
        firstName,
        secondName,
        userPhoto: {
          photoID: '',
          photoURL: ''
        }
      });
      await profile.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

module.exports = router;

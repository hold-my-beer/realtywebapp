const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Proposal = require('../../models/Proposal');

// @route   GET api/proposals
// @desc    Get all proposals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ date: -1 });

    return res.json(proposals);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   GET api/proposals/:id
// @desc    Get proposal by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    return res.json(proposal);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   POST api/proposals
// @desc    Create proposal
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      // check('proposalPhotos.*.url', 'Некорректный url фотографий объекта')
      //   // .if((value, { req }) => req.body.proposalPhotos)
      //   .isURL(),
      check('proposalPhotos', 'Некорректный url фотографий объекта').isURL(),
      check('dealType', 'Укажите корректный тип сделки').isIn([
        'Продаю',
        'Сдаю'
      ]),
      check('address', 'Укажите адрес дома')
        .not()
        .isEmpty(),
      check('houseYear', 'Укажите корректный год постройки дома').isInt({
        min: 1900,
        max: new Date().getFullYear()
      }),
      check('houseType', 'Укажите корректный тип дома').isIn([
        'Панельный',
        'Блочный',
        'Кирпичный',
        'Монолит'
      ]),
      check('floors', 'Укажите корректное количество этажей в доме').isInt({
        min: 1
      }),
      check('elevator', 'Укажите наличие лифта').isIn([
        'Нет',
        'Пассажирский',
        'Пассажирский и грузовой'
      ]),
      check('floor', 'Укажите корректный этаж')
        .isInt({
          min: 1
        })
        .custom((value, { req }) => value <= req.body.floors),
      check('roomsNumber', 'Укажите корректное количество комнат').isInt({
        min: 1
      }),
      check('totalArea', 'Укажите корректную общую площадь').isFloat({
        min: 0.1
      }),
      check('livingArea', 'Укажите корректную жилую площадь')
        .isFloat({ min: 0.1 })
        .custom(
          (value, { req }) =>
            parseFloat(value) <= parseFloat(req.body.totalArea)
        ),
      check('kitchenArea', 'Укажите корректную площадь кухни')
        .isFloat({
          min: 0.1
        })
        .custom(
          (value, { req }) =>
            parseFloat(value) <= parseFloat(req.body.livingArea)
        ),
      check('balcony', 'Укажите наличие балкона').isIn([
        'Нет',
        'Один',
        'Два и более'
      ]),
      check('windows', 'Укажите, куда выходят окна').isIn([
        'На улицу',
        'Во двор',
        'На улицу и во двор'
      ]),
      check('cooker', 'Укажите тип кухонной плиты').isIn([
        'Электрическая',
        'Газовая'
      ]),
      check('bathroom', 'Укажите тип санузла').isIn([
        'Совмещенный',
        'Раздельный',
        'Два и более'
      ]),
      check('price', 'Укажите стоимость квартиры').isInt({
        min: 1
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      proposalPhotos,
      dealType,
      address,
      houseYear,
      houseType,
      floors,
      elevator,
      floor,
      roomsNumber,
      totalArea,
      livingArea,
      kitchenArea,
      balcony,
      windows,
      cooker,
      bathroom,
      price
    } = req.body;

    const proposal = new Proposal();
    proposal.user = req.user.id;
    if (proposalPhotos) proposal.proposalPhotos = proposalPhotos;
    if (dealType) proposal.dealType = dealType;
    if (address) proposal.address = address;
    if (houseYear) proposal.houseYear = houseYear;
    if (houseType) proposal.houseType = houseType;
    if (floors) proposal.floors = floors;
    if (elevator) proposal.elevator = elevator;
    if (floor) proposal.floor = floor;
    if (roomsNumber) proposal.roomsNumber = roomsNumber;
    if (totalArea) proposal.totalArea = totalArea;
    if (livingArea) proposal.livingArea = livingArea;
    if (kitchenArea) proposal.kitchenArea = kitchenArea;
    if (balcony) proposal.balcony = balcony;
    if (windows) proposal.windows = windows;
    if (cooker) proposal.cooker = cooker;
    if (bathroom) proposal.bathroom = bathroom;
    if (price) proposal.price = price;

    try {
      await proposal.save();

      return res.json(proposal);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   PUT api/proposals/:id
// @desc    Update proposal by id
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      // check('proposalPhotos.*.url', 'Некорректный url фотографий объекта')
      //   // .if((value, { req }) => req.body.proposalPhotos)
      //   .isURL(),
      check('proposalPhotos', 'Некорректный url фотографий объекта').isURL(),
      check('dealType', 'Укажите корректный тип сделки').isIn([
        'Продаю',
        'Сдаю'
      ]),
      check('address', 'Укажите адрес дома')
        .not()
        .isEmpty(),
      check('houseYear', 'Укажите корректный год постройки дома').isInt({
        min: 1900,
        max: new Date().getFullYear()
      }),
      check('houseType', 'Укажите корректный тип дома').isIn([
        'Панельный',
        'Блочный',
        'Кирпичный',
        'Монолит'
      ]),
      check('floors', 'Укажите корректное количество этажей в доме').isInt({
        min: 1
      }),
      check('elevator', 'Укажите наличие лифта').isIn([
        'Нет',
        'Пассажирский',
        'Пассажирский и грузовой'
      ]),
      check('floor', 'Укажите корректный этаж')
        .isInt({
          min: 1
        })
        .custom((value, { req }) => value <= req.body.floors),
      check('roomsNumber', 'Укажите корректное количество комнат').isInt({
        min: 1
      }),
      check('totalArea', 'Укажите корректную общую площадь').isFloat({
        min: 0.1
      }),
      check('livingArea', 'Укажите корректную жилую площадь')
        .isFloat({ min: 0.1 })
        .custom(
          (value, { req }) =>
            parseFloat(value) <= parseFloat(req.body.totalArea)
        ),
      check('kitchenArea', 'Укажите корректную площадь кухни')
        .isFloat({
          min: 0.1
        })
        .custom(
          (value, { req }) =>
            parseFloat(value) <= parseFloat(req.body.livingArea)
        ),
      check('balcony', 'Укажите наличие балкона').isIn([
        'Нет',
        'Один',
        'Два и более'
      ]),
      check('windows', 'Укажите, куда выходят окна').isIn([
        'На улицу',
        'Во двор',
        'На улицу и во двор'
      ]),
      check('cooker', 'Укажите тип кухонной плиты').isIn([
        'Электрическая',
        'Газовая'
      ]),
      check('bathroom', 'Укажите тип санузла').isIn([
        'Совмещенный',
        'Раздельный',
        'Два и более'
      ]),
      check('price', 'Укажите стоимость квартиры').isInt({
        min: 1
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      proposalPhotos,
      dealType,
      address,
      houseYear,
      houseType,
      floors,
      elevator,
      floor,
      roomsNumber,
      totalArea,
      livingArea,
      kitchenArea,
      balcony,
      windows,
      cooker,
      bathroom,
      price
    } = req.body;

    try {
      let proposal = await Proposal.findById(req.params.id);

      if (!proposal) {
        return res.status(404).json({ msg: 'Предложение не найдено' });
      }

      if (proposalPhotos) proposal.proposalPhotos = proposalPhotos;
      if (dealType) proposal.dealType = dealType;
      if (address) proposal.address = address;
      if (houseYear) proposal.houseYear = houseYear;
      if (houseType) proposal.houseType = houseType;
      if (floors) proposal.floors = floors;
      if (elevator) proposal.elevator = elevator;
      if (floor) proposal.floor = floor;
      if (roomsNumber) proposal.roomsNumber = roomsNumber;
      if (totalArea) proposal.totalArea = totalArea;
      if (livingArea) proposal.livingArea = livingArea;
      if (kitchenArea) proposal.kitchenArea = kitchenArea;
      if (balcony) proposal.balcony = balcony;
      if (windows) proposal.windows = windows;
      if (cooker) proposal.cooker = cooker;
      if (bathroom) proposal.bathroom = bathroom;
      if (price) proposal.price = price;

      await proposal.save();

      return res.json(proposal);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Предложение не найдено' });
      }
      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   DELETE api/proposals/:id
// @desc    Delete proposal by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Proposal.findByIdAndRemove(req.params.id);

    return res.json({ msg: 'Предложение удалено' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

module.exports = router;

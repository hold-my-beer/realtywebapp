const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, query, validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const config = require('config');

const Proposal = require('../../models/Proposal');
const Province = require('../../models/Province');

// @route   GET api/proposals
// @desc    Get all proposals
// @access  Public
router.get('/', async (req, res) => {
  // console.log(req.query);
  try {
    const proposals = await Proposal.find().sort({ date: -1 });

    return res.json(proposals);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   GET api/proposals/mine
// @desc    Get current user proposals
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find({ user: req.user.id })
      .sort({ isActive: -1 })
      .sort({
        date: -1
      });
    if (!proposals) {
      return res.status(404).json({
        msg: 'У вас нет сохраненных предложений по объектам недвижимости'
      });
    }

    return res.json(proposals);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'У вас нет сохраненных предложений по объектам недвижимости'
      });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   GET api/proposals/:dealType/:address/:houseYearFrom/:houseYearTo/:panel/:block/:brick/:monolithic/:floorsFrom/:floorsTo/:elevator/:floorFrom/:floorTo/:floorExceptLast/:roomsNumberFrom/:roomsNumberTo/:totalAreaFrom/:totalAreaTo/:livingAreaFrom/:livingAreaTo/:kitchenAreaFrom/:kitchenAreaTo/:balcony/:windows/:cooker/:bathRoom/:priceFrom/:priceTo
// @desc    Get proposal by search criteria
// @access  Public
router.get(
  '/search',
  [
    check('dealType', 'Укажите корректный тип сделки').isIn([
      'Продажа',
      'Аренда'
    ]),
    check('province', 'Укажите регион').not().isEmpty(),
    check('locality', 'Укажите населенный пункт').not().isEmpty(),
    check('houseYearFrom', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val)
      .isInt({
        min: 1850,
        max: new Date().getFullYear()
      }),
    check('houseYearTo', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val)
      .isInt({
        min: 1850,
        max: new Date().getFullYear()
      }),
    check('houseYearTo', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val && req.query.houseYearFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.query.houseYearFrom)
      ),
    check('panel', 'Укажите корректный тип дома')
      .if((val, { req }) => val)
      .isIn(['Панельный']),
    check('block', 'Укажите корректный тип дома')
      .if((val, { req }) => val)
      .isIn(['Блочный']),
    check('brick', 'Укажите корректный тип дома')
      .if((val, { req }) => val)
      .isIn(['Кирпичный']),
    check('monolithic', 'Укажите корректный тип дома')
      .if((val, { req }) => val)
      .isIn(['Монолит']),
    check('floorsFrom', 'Укажите корректное количество этажей в доме')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorsTo', 'Укажите корректное количество этажей в доме')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorsTo', 'Укажите корректное количество этажей в доме')
      .if((val, { req }) => val && req.query.floorsFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.query.floorsFrom)
      ),
    check('elevator', 'Укажите наличие лифта')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Пассажирский', 'Пассажирский и грузовой']),
    check('floorFrom', 'Укажите корректный этаж')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorFrom', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.query.floorsTo)
      .custom((val, { req }) => parseInt(val) <= parseInt(req.query.floorsTo)),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.query.floorsFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.query.floorsFrom)
      ),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.query.floorsTo)
      .custom((val, { req }) => parseInt(val) <= parseInt(req.query.floorsTo)),
    check('roomsNumberFrom', 'Укажите корректное количество комнат')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('roomsNumberTo', 'Укажите корректное количество комнат')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('roomsNumberTo', 'Укажите корректное количество комнат')
      .if((val, { req }) => val && req.query.roomsNumberFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.query.roomsNumberFrom)
      ),
    check('totalAreaFrom', 'Укажите корректную общую площадь')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    check('totalAreaTo', 'Укажите корректную общую площадь')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    check('totalAreaTo', 'Укажите корректную общую площадь')
      .if((val, { req }) => val && req.query.totalAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) >= parseFloat(req.query.totalAreaFrom)
      ),
    check('livingAreaFrom', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val)
      .isFloat({ min: 0.1 }),
    // check('livingAreaFrom', 'Укажите корректную жилую площадь')
    //   .if((val, { req }) => val && req.query.totalAreaFrom)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaFrom)
    //   ),
    check('livingAreaFrom', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.query.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaTo)
      ),
    check('livingAreaTo', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val)
      .isFloat({ min: 0.1 }),
    check('livingAreaTo', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.query.livingAreaFrom)
      .custom(
        (val, { req }) =>
          parseFloat(val) >= parseFloat(req.query.livingAreaFrom)
      ),
    // check('livingAreaTo', 'Укажите корректную жилую площадь')
    //   .if((val, { req }) => val && req.query.totalAreaTo)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaTo)
    //   ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    // check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.totalAreaFrom)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaFrom)
    //   ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.query.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaTo)
      ),
    // check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.livingAreaFrom)
    //   .custom(
    //     (val, { req }) =>
    //       parseFloat(val) <= parseFloat(req.query.livingAreaFrom)
    //   ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.query.livingAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.query.livingAreaTo)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.query.kitchenAreaFrom)
      .custom(
        (val, { req }) =>
          parseFloat(val) >= parseFloat(req.query.kitchenAreaFrom)
      ),
    // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.totalAreaFrom)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaFrom)
    //   ),
    // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.totalAreaTo)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.totalAreaTo)
    //   ),
    // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.livingAreaFrom)
    //   .custom(
    //     (val, { req }) =>
    //       parseFloat(val) <= parseFloat(req.query.livingAreaFrom)
    //   ),
    // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
    //   .if((val, { req }) => val && req.query.livingAreaTo)
    //   .custom(
    //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.livingAreaTo)
    //   ),
    check('balcony', 'Укажите корректные данные по балкону')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Есть', 'Два и более']),
    check('windows', 'Укажите корректные данные по окнам')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'На улицу', 'Во двор', 'На улицу и во двор']),
    check('cooker', 'Укажите корректный тип кухонной плиты')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Электрическая', 'Газовая']),
    check('bathroom', 'Укажите корректный тип санузла')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Совмещенный', 'Раздельный', 'Два и более']),
    check('priceFrom', 'Укажите корректную стоимость квартиры')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('priceTo', 'Укажите корректную стоимость квартиры')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('priceTo', 'Укажите корректную стоимость квартиры')
      .if((val, { req }) => val && req.query.priceFrom)
      .custom((val, { req }) => parseInt(val) >= parseInt(req.query.priceFrom))
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.query);

    let elevatorArray = [];
    switch (req.query.elevator) {
      case 'Не важно':
        elevatorArray = ['Нет', 'Пассажирский', 'Пассажирский и грузовой'];
        break;
      case 'Пассажирский':
        elevatorArray = ['Пассажирский', 'Пассажирский и грузовой'];
        break;
      case 'Пассажирский и грузовой':
        elevatorArray = ['Пассажирский и грузовой'];
        break;
      default:
        elevatorArray = ['Нет', 'Пассажирский', 'Пассажирский и грузовой'];
    }

    // let lastFloorArray =
    //   req.query.floorExceptLast === true ? [false] : [true, false];

    let balconyArray = [];
    switch (req.query.balcony) {
      case 'Не важно':
        balconyArray = ['Нет', 'Один', 'Два и более'];
        break;
      case 'Есть':
        balconyArray = ['Один', 'Два и более'];
        break;
      case 'Два и более':
        balconyArray = ['Два и более'];
        break;
      default:
        ['Нет', 'Один', 'Два и более'];
    }

    const windowsArray =
      req.query.windows === 'Не важно'
        ? ['На улицу', 'Во двор', 'На улицу и во двор']
        : [req.query.windows];

    const cookerArray =
      req.query.cooker === 'Не важно'
        ? ['Электрическая', 'Газовая']
        : [req.query.cooker];

    const bathroomArray =
      req.query.bathroom === 'Не важно'
        ? ['Совмещенный', 'Раздельный', 'Два и более']
        : [req.query.bathroom];

    try {
      const proposals = await Proposal.find({
        $and: [
          { isActive: true },
          { dealType: req.query.dealType },
          { 'address.province': req.query.province },
          { 'address.locality': req.query.locality },
          {
            'address.district':
              req.query.addressDistricts !== ''
                ? {
                    $in: req.query.addressDistricts
                  }
                : { $exists: true }
          },
          {
            'address.route':
              req.query.addressRoutes !== ''
                ? {
                    $in: req.query.addressRoutes
                  }
                : { $exists: true }
          },
          {
            'address.metro':
              req.query.addressMetros !== ''
                ? {
                    $in: req.query.addressMetros
                  }
                : { $exists: true }
          },
          {
            $or: [
              {
                'address.metroDuration.pedestrian.value': req.query
                  .pedestrian === 'true' &&
                  req.query.metroDuration !== '' && {
                    $lte: req.query.metroDuration * 60
                  }
              },

              {
                $or: [
                  {
                    'address.metroDuration.auto.value':
                      req.query.pedestrian === 'false' &&
                      (req.query.metroDuration !== ''
                        ? {
                            $lte: req.query.metroDuration * 60
                          }
                        : { $exists: true })
                  },
                  {
                    'address.metroDuration.masstransit.value':
                      req.query.pedestrian === 'false' &&
                      (req.query.metroDuration !== ''
                        ? {
                            $lte: req.query.metroDuration * 60
                          }
                        : { $exists: true })
                  },
                  {
                    'address.metroDuration.pedestrian.value':
                      req.query.pedestrian === 'false' &&
                      (req.query.metroDuration !== ''
                        ? {
                            $lte: req.query.metroDuration * 60
                          }
                        : { $exists: true })
                  }
                ]
              }
            ]
          },
          {
            houseYear:
              req.query.houseYearFrom !== ''
                ? {
                    $gte: req.query.houseYearFrom
                  }
                : { $exists: true }
          },
          {
            houseYear:
              req.query.houseYearTo !== ''
                ? {
                    $lte: req.query.houseYearTo
                  }
                : { $exists: true }
          },
          {
            $or: [
              { houseType: req.query.panel },
              { houseType: req.query.block },
              { houseType: req.query.brick },
              { houseType: req.query.monolithic }
            ]
          },
          {
            floors:
              req.query.floorsFrom !== ''
                ? { $gte: req.query.floorsFrom }
                : { $exists: true }
          },
          {
            floors:
              req.query.floorsTo !== ''
                ? { $lte: req.query.floorsTo }
                : { $exists: true }
          },
          { elevator: { $in: elevatorArray } },
          {
            floor:
              req.query.floorFrom !== ''
                ? { $gte: req.query.floorFrom }
                : { $exists: true }
          },
          {
            floor:
              req.query.floorTo !== ''
                ? { $lte: req.query.floorTo }
                : { $exists: true }
          },
          {
            isLastFloor:
              req.query.exceptLast === 'true' ? false : { $exists: true }
          },
          // { isLastFloor: { $in: lastFloorArray } },
          {
            roomsNumber:
              req.query.roomsNumberFrom !== ''
                ? { $gte: req.query.roomsNumberFrom }
                : { $exists: true }
          },
          {
            roomsNumber:
              req.query.roomsNumberTo !== ''
                ? { $lte: req.query.roomsNumberTo }
                : { $exists: true }
          },
          {
            totalArea:
              req.query.totalAreaFrom !== ''
                ? { $gte: req.query.totalAreaFrom }
                : { $exists: true }
          },
          {
            totalArea:
              req.query.totalAreaTo !== ''
                ? { $lte: req.query.totalAreaTo }
                : { $exists: true }
          },
          {
            livingArea:
              req.query.livingAreaFrom !== ''
                ? { $gte: req.query.livingAreaFrom }
                : { $exists: true }
          },
          {
            livingArea:
              req.query.livingAreaTo !== ''
                ? { $lte: req.query.livingAreaTo }
                : { $exists: true }
          },
          {
            kitchenArea:
              req.query.kitchenAreaFrom !== ''
                ? { $gte: req.query.kitchenAreaFrom }
                : { $exists: true }
          },
          {
            kitchenArea: req.query.kitchenAreaTo
              ? { $lte: req.query.kitchenAreaTo }
              : { $exists: true }
          },
          { balcony: { $in: balconyArray } },
          { windows: { $in: windowsArray } },
          { cooker: { $in: cookerArray } },
          { bathroom: { $in: bathroomArray } },
          { price: { $gte: req.query.priceFrom } },
          { price: { $lte: req.query.priceTo } }
        ]
      });

      if (!proposals) {
        return res.status(404).json({
          msg: 'Объекты, удовлетворяющие заданным параметрам поиска, не найдены'
        });
      }

      return res.json(proposals);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          msg: 'Объекты, удовлетворяющие заданным параметрам поиска, не найдены'
        });
      }

      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   GET api/proposals/favorites
// @desc    Get user favorites
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

    // const proposals = [];

    // for (const favorite of profile.favorites) {
    //   proposals.push(await Proposal.findById(favorite));
    // }

    const proposals = await Proposal.find({
      _id: { $in: profile.favorites }
    }).sort({ isActive: -1 });

    return res.json(proposals);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Профиль не найден' });
    }

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
      // check('proposalPhotos', 'Некорректный url фотографий объекта').isURL(),
      check('dealType', 'Укажите корректный тип сделки').isIn([
        'Продажа',
        'Аренда'
      ]),
      check('address', 'Укажите адрес дома').not().isEmpty(),
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
        .custom(
          (value, { req }) => parseInt(value) <= parseInt(req.body.floors)
        ),
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
    if (proposalPhotos) {
      proposal.proposalPhotos = proposalPhotos;
    }
    // else {
    //   proposal.proposalPhotos = {};
    // }
    if (dealType) proposal.dealType = dealType;
    if (address) {
      // console.log(address);
      // exclude country from address
      // const index = address.indexOf(',') + 2;
      // proposal.address = address.substring(index);
      proposal.address = address;
    }
    if (houseYear) proposal.houseYear = houseYear;
    if (houseType) proposal.houseType = houseType;
    if (floors) proposal.floors = floors;
    if (elevator) proposal.elevator = elevator;
    if (floor) proposal.floor = floor;
    if (floor && floors) proposal.isLastFloor = floor === floors ? true : false;
    if (roomsNumber) proposal.roomsNumber = roomsNumber;
    if (totalArea) proposal.totalArea = totalArea;
    if (livingArea) proposal.livingArea = livingArea;
    if (kitchenArea) proposal.kitchenArea = kitchenArea;
    if (balcony) proposal.balcony = balcony;
    if (windows) proposal.windows = windows;
    if (cooker) proposal.cooker = cooker;
    if (bathroom) proposal.bathroom = bathroom;
    if (price) proposal.price = price;

    const { province, locality, district, route, metro } = address;

    try {
      // Update province data if necessary
      let provinceToFind = await Province.findOne({ name: province });

      if (!provinceToFind) {
        let newProvince = new Province({ name: province, localities: [] });

        // if (province) newProvince.name = province;
        if (locality) {
          let newLocality = {
            name: locality,
            districts: [],
            routes: []
          };
          // newLocality.name = locality;

          if (district) newLocality.districts.push({ name: district });
          // console.log(newLocality);
          if (route && metro) {
            let newRoute = {
              name: route,
              metros: []
            };
            newRoute.metros.push({ name: metro });
            newLocality.routes.push(newRoute);
            // console.log(newLocality);
          }

          newProvince.localities.push(newLocality);
          // console.log(newProvince);
        }

        newProvince.save();
      } else {
        if (province) provinceToFind.name = province;
        if (locality) {
          let foundLocality = false;
          provinceToFind.localities.forEach(localityItem => {
            if (localityItem.name === locality) {
              foundLocality = true;
              // Check if district exists
              if (district) {
                if (localityItem.districts) {
                  const districtIndex = localityItem.districts
                    .map(districtItem => districtItem.name)
                    .indexOf(district);
                  if (districtIndex === -1) {
                    localityItem.districts.push({ name: district });
                  }
                } else {
                  localityItem.districts = [];
                  localityItem.districts.push({ name: district });
                }
              }

              // Check if route and metro exist
              if (route && metro) {
                if (localityItem.routes) {
                  let foundRoute = false;
                  localityItem.routes.forEach(routeItem => {
                    if (routeItem.name === route) {
                      foundRoute = true;
                      const metroIndex = routeItem.metros
                        .map(metroItem => metroItem.name)
                        .indexOf(metro);
                      if (metroIndex === -1) {
                        routeItem.metros.push({ name: metro });
                      }
                    }
                  });
                  if (!foundRoute) {
                    localityItem.routes.push({
                      name: route,
                      metros: [{ name: metro }]
                    });
                  }
                } else {
                  let newRoute = {
                    name: route,
                    metros: []
                  };
                  newRoute.metros.push({ name: metro });
                  localityItem.routes.push(newRoute);
                }
              }
            }
          });
          if (!foundLocality) {
            let newLocality = {
              name: locality,
              districts: [],
              routes: []
            };

            if (district) newLocality.districts.push({ name: district });
            if (route && metro) {
              let newRoute = {
                name: route,
                metros: []
              };
              newRoute.metros.push({ name: metro });
              newLocality.routes.push(newRoute);
            }

            provinceToFind.localities.push(newLocality);
          }
        }

        provinceToFind.save();
      }

      // Save proposal
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
      // check('proposalPhotos', 'Некорректный url фотографий объекта').isURL(),
      check('dealType', 'Укажите корректный тип сделки').isIn([
        'Продажа',
        'Аренда'
      ]),
      check('address', 'Укажите адрес дома').not().isEmpty(),
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
      photosToAdd,
      photosToDestroy,
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

      if (proposal.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
        });
      }

      if (photosToDestroy.length > 0) {
        cloudinary.config({
          cloud_name: config.get('cloudinary_cloud_name'),
          api_key: config.get('cloudinary_api_key'),
          api_secret: config.get('cloudinary_api_secret')
        });

        await cloudinary.v2.api.delete_resources(photosToDestroy, {
          invalidate: true
        });

        proposal.proposalPhotos = proposal.proposalPhotos.filter(photo => {
          for (let i = 0; i < photosToDestroy.length; i++) {
            if (photo.photoID === photosToDestroy[i]) {
              return false;
            }
          }

          return true;
        });
      }

      if (photosToAdd.length > 0) {
        proposal.proposalPhotos = [...proposal.proposalPhotos, ...photosToAdd];
      }

      if (dealType) proposal.dealType = dealType;
      if (address) {
        // exclude country from address

        proposal.address = address;
      }
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

      const { province, locality, district, route, metro } = address;

      // Update province data if necessary
      let provinceToFind = await Province.findOne({ name: province });

      if (!provinceToFind) {
        let newProvince = new Province({ name: province, localities: [] });

        // if (province) newProvince.name = province;
        if (locality) {
          let newLocality = {
            name: locality,
            districts: [],
            routes: []
          };
          // newLocality.name = locality;

          if (district) newLocality.districts.push({ name: district });
          // console.log(newLocality);
          if (route && metro) {
            let newRoute = {
              name: route,
              metros: []
            };
            newRoute.metros.push({ name: metro });
            newLocality.routes.push(newRoute);
            // console.log(newLocality);
          }

          newProvince.localities.push(newLocality);
          // console.log(newProvince);
        }

        newProvince.save();
      } else {
        if (province) provinceToFind.name = province;
        if (locality) {
          let foundLocality = false;
          provinceToFind.localities.forEach(localityItem => {
            if (localityItem.name === locality) {
              foundLocality = true;
              // Check if district exists
              if (district) {
                if (localityItem.districts) {
                  const districtIndex = localityItem.districts
                    .map(districtItem => districtItem.name)
                    .indexOf(district);
                  if (!districtIndex === -1) {
                    localityItem.districts.push({ name: district });
                  } else {
                    localityItem.districts = [];
                    localityItem.districts.push({ name: district });
                  }
                }
              }

              // Check if route and metro exist
              if (route && metro) {
                if (localityItem.routes) {
                  let foundRoute = false;
                  localityItem.routes.forEach(routeItem => {
                    if (routeItem.name === route) {
                      foundRoute = true;
                      const metroIndex = routeItem.metros
                        .map(metroItem => metroItem.name)
                        .indexOf(metro);
                      if (metroIndex === -1) {
                        routeItem.metros.push({ name: metro });
                      }
                    }
                  });
                  if (!foundRoute) {
                    localityItem.routes.push({
                      name: route,
                      metros: [{ name: metro }]
                    });
                  }
                } else {
                  let newRoute = {
                    name: route,
                    metros: []
                  };
                  newRoute.metros.push({ name: metro });
                  localityItem.routes.push(newRoute);
                }
              }
            }
          });
          if (!foundLocality) {
            let newLocality = {
              name: locality,
              districts: [],
              routes: []
            };

            if (district) newLocality.districts.push({ name: district });
            if (route && metro) {
              let newRoute = {
                name: route,
                metros: []
              };
              newRoute.metros.push({ name: metro });
              newLocality.routes.push(newRoute);
            }

            provinceToFind.localities.push(newLocality);
          }
        }

        provinceToFind.save();
      }

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

// @route   PUT api/proposals/activate/:id
// @desc    Activate proposal
// @access  Private
router.put('/activate/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    if (proposal.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
      });
    }

    proposal.isActive = true;

    await proposal.save();

    return res.json(proposal);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   PUT api/proposals/deactivate/:id
// @desc    Deactivate proposal
// @access  Private
router.put('/deactivate/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    if (proposal.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
      });
    }

    proposal.isActive = false;

    await proposal.save();

    return res.json(proposal);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   DELETE api/proposals/:id
// @desc    Delete proposal by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    if (proposal.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
      });
    }

    if (proposal.proposalPhotos.length > 0) {
      const photosToDestroy = [];
      proposal.proposalPhotos.forEach(photo => {
        photosToDestroy.push(photo.photoID);
      });

      cloudinary.config({
        cloud_name: config.get('cloudinary_cloud_name'),
        api_key: config.get('cloudinary_api_key'),
        api_secret: config.get('cloudinary_api_secret')
      });

      await cloudinary.v2.api.delete_resources(photosToDestroy, {
        invalidate: true
      });
    }

    await proposal.remove();

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

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const config = require('config');

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

// @route   GET api/proposals/mine
// @desc    Get current user proposals
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find({ user: req.user.id }).sort({
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
  '/:dealType/:address/:houseYearFrom/:houseYearTo/:panel/:block/:brick/:monolithic/:floorsFrom/:floorsTo/:elevator/:floorFrom/:floorTo/:floorExceptLast/:roomsNumberFrom/:roomsNumberTo/:totalAreaFrom/:totalAreaTo/:livingAreaFrom/:livingAreaTo/:kitchenAreaFrom/:kitchenAreaTo/:balcony/:windows/:cooker/:bathroom/:priceFrom/:priceTo',
  [
    check('dealType', 'Укажите корректный тип сделки').isIn(['Продаю', 'Сдаю']),
    check('houseYearFrom', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val)
      .isInt({
        min: 1900,
        max: new Date().getFullYear()
      }),
    check('houseYearTo', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val)
      .isInt({
        min: 1900,
        max: new Date().getFullYear()
      }),
    check('houseYearTo', 'Укажите корректный год постройки дома')
      .if((val, { req }) => val && req.body.houseYearFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.body.houseYearFrom)
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
      .if((val, { req }) => val && req.body.floorsFrom)
      .custom((val, { req }) => parseInt(val) >= parseInt(req.body.floorsFrom)),
    check('elevator', 'Укажите наличие лифта')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Пассажирский', 'Пассажирский и грузовой']),
    check('floorFrom', 'Укажите корректный этаж')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorFrom', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.body.floorsTo)
      .custom((val, { req }) => parseInt(val) <= parseInt(req.body.floorsTo)),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val)
      .isInt({
        min: 1
      }),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.body.floorsFrom)
      .custom((val, { req }) => parseInt(val) >= parseInt(req.body.floorsFrom)),
    check('floorTo', 'Укажите корректный этаж')
      .if((val, { req }) => val && req.body.floorsTo)
      .custom((val, { req }) => parseInt(val) <= parseInt(req.body.floorsTo)),
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
      .if((val, { req }) => val && req.body.roomsNumberFrom)
      .custom(
        (val, { req }) => parseInt(val) >= parseInt(req.body.roomsNumberFrom)
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
      .if((val, { req }) => val && req.body.totalAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) >= parseFloat(req.body.totalAreaFrom)
      ),
    check('livingAreaFrom', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val)
      .isFloat({ min: 0.1 }),
    check('livingAreaFrom', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.body.totalAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
      ),
    check('livingAreaFrom', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.body.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
      ),
    check('livingAreaTo', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val)
      .isFloat({ min: 0.1 }),
    check('livingAreaTo', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.body.livingAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) >= parseFloat(req.body.livingAreaFrom)
      ),
    check('livingAreaTo', 'Укажите корректную жилую площадь')
      .if((val, { req }) => val && req.body.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
      ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.totalAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
      ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
      ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.livingAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.livingAreaFrom)
      ),
    check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.livingAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.livingAreaTo)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val)
      .isFloat({
        min: 0.1
      }),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.kitchenAreaFrom)
      .custom(
        (val, { req }) =>
          parseFloat(val) >= parseFloat(req.body.kitchenAreaFrom)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.totalAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.totalAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.livingAreaFrom)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.livingAreaFrom)
      ),
    check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      .if((val, { req }) => val && req.body.livingAreaTo)
      .custom(
        (val, { req }) => parseFloat(val) <= parseFloat(req.body.livingAreaTo)
      ),
    check('balcony', 'Укажите корректные данные по балкону')
      .if((val, { req }) => val)
      .isIn(['Не важно', 'Один', 'Два и более']),
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
      .if((val, { req }) => val && req.body.priceFrom)
      .custom((val, { req }) => parseInt(val) >= parseInt(req.body.priceFrom))
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let elevatorArray = [];
    switch (req.params.elevator) {
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

    let lastFloorArray =
      req.params.floorExceptLast === true ? [false] : [true, false];

    let balconyArray = [];
    switch (req.params.balcony) {
      case 'Не важно':
        balconyArray = ['Нет', 'Один', 'Два и более'];
        break;
      case 'Один':
        balconyArray = ['Один', 'Два и более'];
        break;
      case 'Два и более':
        balconyArray = ['Два и более'];
        break;
      default:
        ['Нет', 'Один', 'Два и более'];
    }

    const windowsArray =
      req.params.windows === 'Не важно'
        ? ['На улицу', 'Во двор', 'На улицу и во двор']
        : [req.params.windows];

    const cookerArray =
      req.params.cooker === 'Не важно'
        ? ['Электрическая', 'Газовая']
        : [req.params.cooker];

    const bathroomArray =
      req.params.bathroom === 'Не важно'
        ? ['Совмещенный', 'Раздельный', 'Два и более']
        : [req.params.bathroom];

    try {
      const proposals = await Proposal.find({
        $and: [
          { dealType: req.params.dealType },
          { address: req.params.address },
          { houseYear: { $gte: req.params.houseYearFrom } },
          { houseYear: { $lte: req.params.houseYearTo } },
          {
            $or: [
              { houseType: req.params.panel },
              { houseType: req.params.block },
              { houseType: req.params.brick },
              { houseType: req.params.monolithic }
            ]
          },
          { floors: { $gte: req.params.floorsFrom } },
          { floors: { $lte: req.params.floorsTo } },
          { elevator: { $in: elevatorArray } },
          { floor: { $gte: req.params.floorFrom } },
          { floor: { $lte: req.params.floorTo } },
          { isLastFloor: { $in: lastFloorArray } },
          { roomsNumber: { $gte: req.params.roomsNumberFrom } },
          { roomsNumber: { $lte: req.params.roomsNumberTo } },
          { totalArea: { $gte: req.params.totalAreaFrom } },
          { totalArea: { $lte: req.params.totalAreaTo } },
          { livingArea: { $gte: req.params.livingAreaFrom } },
          { livingArea: { $lte: req.params.livingAreaTo } },
          { kitchenArea: { $gte: req.params.kitchenAreaFrom } },
          { kitchenArea: { $lte: req.params.kitchenAreaTo } },
          { balcony: { $in: balconyArray } },
          { windows: { $in: windowsArray } },
          { cooker: { $in: cookerArray } },
          { bathroom: { $in: bathroomArray } },
          { price: { $gte: req.params.priceFrom } },
          { price: { $lte: req.params.priceTo } }
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
    } else {
      proposal.proposalPhotos = {};
    }
    if (dealType) proposal.dealType = dealType;
    if (address) {
      // exclude country from address
      const index = address.indexOf(',') + 2;
      proposal.address = address.substring(index);
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
        if (address.indexOf('Россия') === 0) {
          const index = address.indexOf(',') + 2;
          proposal.address = address.substring(index);
        }
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
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ msg: 'Предложение не найдено' });
    }

    if (proposal.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
      });
    }

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

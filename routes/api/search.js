const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Search = require('../../models/Search');

// @route   GET api/search
// @desc    Get user search criteria
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const searches = await Search.find({ user: req.user.id });

    if (!searches) {
      return res.status(404).json({ msg: 'Критерии поиска не найдены' });
    }

    return res.json(searches);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   GET api/search/:id
// @desc    Get user search criteria by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const search = await Search.findById(req.params.id);

    if (!search) {
      return res.status(404).json({ msg: 'Критерии поиска не найдены' });
    }

    return res.json(search);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Критерии поиска не найдены' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   POST api/search
// @desc    Create search criteria
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('searchType', 'Укажите корректный тип поиска').isIn(['0', '1']),
      check('data.dealType', 'Укажите корректный тип сделки').isIn([
        'Продажа',
        'Аренда'
      ]),
      check('address.province', 'Укажите регион').not().isEmpty(),
      check('address.locality', 'Укажите населенный пункт').not().isEmpty(),
      check('data.houseYearFrom', 'Укажите корректный год постройки дома')
        .if((val, { req }) => val)
        .isInt({
          min: 1850,
          max: new Date().getFullYear()
        }),
      check('data.houseYearTo', 'Укажите корректный год постройки дома')
        .if((val, { req }) => val)
        .isInt({
          min: 1850,
          max: new Date().getFullYear()
        }),
      check('data.houseYearTo', 'Укажите корректный год постройки дома')
        .if((val, { req }) => val && req.query.data.houseYearFrom)
        .custom(
          (val, { req }) =>
            parseInt(val) >= parseInt(req.query.data.houseYearFrom)
        ),
      check('data.panel', 'Укажите корректный тип дома')
        .if((val, { req }) => val)
        .isIn(['Панельный']),
      check('data.block', 'Укажите корректный тип дома')
        .if((val, { req }) => val)
        .isIn(['Блочный']),
      check('data.brick', 'Укажите корректный тип дома')
        .if((val, { req }) => val)
        .isIn(['Кирпичный']),
      check('data.monolithic', 'Укажите корректный тип дома')
        .if((val, { req }) => val)
        .isIn(['Монолит']),
      check('data.floorsFrom', 'Укажите корректное количество этажей в доме')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.floorsTo', 'Укажите корректное количество этажей в доме')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.floorsTo', 'Укажите корректное количество этажей в доме')
        .if((val, { req }) => val && req.query.data.floorsFrom)
        .custom(
          (val, { req }) => parseInt(val) >= parseInt(req.query.data.floorsFrom)
        ),
      check('data.elevator', 'Укажите наличие лифта')
        .if((val, { req }) => val)
        .isIn(['Не важно', 'Пассажирский', 'Пассажирский и грузовой']),
      check('data.floorFrom', 'Укажите корректный этаж')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.floorFrom', 'Укажите корректный этаж')
        .if((val, { req }) => val && req.query.data.floorsTo)
        .custom(
          (val, { req }) => parseInt(val) <= parseInt(req.query.data.floorsTo)
        ),
      check('data.floorTo', 'Укажите корректный этаж')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.floorTo', 'Укажите корректный этаж')
        .if((val, { req }) => val && req.query.data.floorsFrom)
        .custom(
          (val, { req }) => parseInt(val) >= parseInt(req.query.data.floorsFrom)
        ),
      check('data.floorTo', 'Укажите корректный этаж')
        .if((val, { req }) => val && req.query.data.floorsTo)
        .custom(
          (val, { req }) => parseInt(val) <= parseInt(req.query.data.floorsTo)
        ),
      check('data.roomsNumberFrom', 'Укажите корректное количество комнат')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.roomsNumberTo', 'Укажите корректное количество комнат')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.roomsNumberTo', 'Укажите корректное количество комнат')
        .if((val, { req }) => val && req.query.data.roomsNumberFrom)
        .custom(
          (val, { req }) =>
            parseInt(val) >= parseInt(req.query.data.roomsNumberFrom)
        ),
      check('data.totalAreaFrom', 'Укажите корректную общую площадь')
        .if((val, { req }) => val)
        .isFloat({
          min: 0.1
        }),
      check('data.totalAreaTo', 'Укажите корректную общую площадь')
        .if((val, { req }) => val)
        .isFloat({
          min: 0.1
        }),
      check('data.totalAreaTo', 'Укажите корректную общую площадь')
        .if((val, { req }) => val && req.query.data.totalAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) >= parseFloat(req.query.data.totalAreaFrom)
        ),
      check('data.livingAreaFrom', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val)
        .isFloat({ min: 0.1 }),
      // check('livingAreaFrom', 'Укажите корректную жилую площадь')
      //   .if((val, { req }) => val && req.query.data.totalAreaFrom)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.totalAreaFrom)
      //   ),
      check('data.livingAreaFrom', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val && req.query.data.totalAreaTo)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.query.data.totalAreaTo)
        ),
      check('data.livingAreaTo', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val)
        .isFloat({ min: 0.1 }),
      check('data.livingAreaTo', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val && req.query.data.livingAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) >= parseFloat(req.query.data.livingAreaFrom)
        ),
      // check('livingAreaTo', 'Укажите корректную жилую площадь')
      //   .if((val, { req }) => val && req.query.data.totalAreaTo)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.totalAreaTo)
      //   ),
      check('data.kitchenAreaFrom', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val)
        .isFloat({
          min: 0.1
        }),
      // check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.totalAreaFrom)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.totalAreaFrom)
      //   ),
      check('data.kitchenAreaFrom', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.query.data.totalAreaTo)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.query.data.totalAreaTo)
        ),
      // check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.livingAreaFrom)
      //   .custom(
      //     (val, { req }) =>
      //       parseFloat(val) <= parseFloat(req.query.data.livingAreaFrom)
      //   ),
      check('data.kitchenAreaFrom', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.query.data.livingAreaTo)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.query.data.livingAreaTo)
        ),
      check('data.kitchenAreaTo', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val)
        .isFloat({
          min: 0.1
        }),
      check('data.kitchenAreaTo', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.query.data.kitchenAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) >= parseFloat(req.query.data.kitchenAreaFrom)
        ),
      // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.totalAreaFrom)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.totalAreaFrom)
      //   ),
      // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.totalAreaTo)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.totalAreaTo)
      //   ),
      // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.livingAreaFrom)
      //   .custom(
      //     (val, { req }) =>
      //       parseFloat(val) <= parseFloat(req.query.data.livingAreaFrom)
      //   ),
      // check('kitchenAreaTo', 'Укажите корректную площадь кухни')
      //   .if((val, { req }) => val && req.query.data.livingAreaTo)
      //   .custom(
      //     (val, { req }) => parseFloat(val) <= parseFloat(req.query.data.livingAreaTo)
      //   ),
      check('data.balcony', 'Укажите корректные данные по балкону')
        .if((val, { req }) => val)
        .isIn(['Не важно', 'Есть', 'Два и более']),
      check('data.windows', 'Укажите корректные данные по окнам')
        .if((val, { req }) => val)
        .isIn(['Не важно', 'На улицу', 'Во двор', 'На улицу и во двор']),
      check('data.cooker', 'Укажите корректный тип кухонной плиты')
        .if((val, { req }) => val)
        .isIn(['Не важно', 'Электрическая', 'Газовая']),
      check('data.bathroom', 'Укажите корректный тип санузла')
        .if((val, { req }) => val)
        .isIn(['Не важно', 'Совмещенный', 'Раздельный', 'Два и более']),
      check('data.priceFrom', 'Укажите корректную стоимость квартиры')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.priceTo', 'Укажите корректную стоимость квартиры')
        .if((val, { req }) => val)
        .isInt({
          min: 1
        }),
      check('data.priceTo', 'Укажите корректную стоимость квартиры')
        .if((val, { req }) => val && req.query.data.priceFrom)
        .custom(
          (val, { req }) => parseInt(val) >= parseInt(req.query.data.priceFrom)
        )
    ]
  ],
  async (req, res) => {
    // console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      searchType,
      // dealType,
      address,
      data
      // province,
      // locality,
      // metroDuration,
      // pedestrian,
      // addressDistricts,
      // addressRoutes,
      // addressMetros,
      // houseYearFrom,
      // houseYearTo,
      // panel,
      // block,
      // brick,
      // monolithic,
      // floorsFrom,
      // floorsTo,
      // elevator,
      // floorFrom,
      // floorTo,
      // exceptLast,
      // roomsNumberFrom,
      // roomsNumberTo,
      // totalAreaFrom,
      // totalAreaTo,
      // livingAreaFrom,
      // livingAreaTo,
      // kitchenAreaFrom,
      // kitchenAreaTo,
      // balcony,
      // windows,
      // cooker,
      // bathroom,
      // priceFrom,
      // priceTo
    } = req.body;

    const search = new Search();

    search.user = req.user.id;
    if (name) search.name = name;
    if (searchType) search.searchType = searchType;
    if (data.dealType) search.dealType = data.dealType;
    if (address.province) search.province = address.province;
    if (address.locality) search.locality = address.locality;
    if (address.metroDuration) search.metroDuration = address.metroDuration;
    if (address.pedestrian) search.pedestrian = address.pedestrian;
    if (address.addressDistricts)
      search.addressDistricts = address.addressDistricts;
    if (address.addressRoutes) search.addressRoutes = address.addressRoutes;
    if (address.adressMetros) search.adressMetros = address.adressMetros;
    if (data.houseYearFrom) search.houseYearFrom = data.houseYearFrom;
    if (data.houseYearTo) search.houseYearTo = data.houseYearTo;
    if (data.panel) search.panel = data.panel;
    if (data.brick) search.brick = data.brick;
    if (data.block) search.block = data.block;
    if (data.monolithic) search.monolithic = data.monolithic;
    // if (houseType) search.houseType = houseType;
    if (data.floorsFrom) search.floorsFrom = data.floorsFrom;
    if (data.floorsTo) search.floorsTo = data.floorsTo;
    if (data.elevator) search.elevator = data.elevator;
    if (data.floorFrom) search.floorFrom = data.floorFrom;
    if (data.floorTo) search.floorTo = data.floorTo;
    if (data.exceptLast) search.exceptLast = data.exceptLast;
    if (data.roomsNumberFrom) search.roomsNumberFrom = data.roomsNumberFrom;
    if (data.roomsNumberTo) search.roomsNumberTo = data.roomsNumberTo;
    if (data.totalAreaFrom) search.totalAreaFrom = data.totalAreaFrom;
    if (data.totalAreaTo) search.totalAreaTo = data.totalAreaTo;
    if (data.livingAreaFrom) search.livingAreaFrom = data.livingAreaFrom;
    if (data.livingAreaTo) search.livingAreaTo = data.livingAreaTo;
    if (data.kitchenAreaFrom) search.kitchenAreaFrom = data.kitchenAreaFrom;
    if (data.kitchenAreaTo) search.kitchenAreaTo = data.kitchenAreaTo;
    if (data.balcony) search.balcony = data.balcony;
    if (data.windows) search.windows = data.windows;
    if (data.cooker) search.cooker = data.cooker;
    if (data.bathroom) search.bathroom = data.bathroom;
    if (data.priceFrom) search.priceFrom = data.priceFrom;
    if (data.priceTo) search.priceTo = data.priceTo;

    try {
      await search.save();

      return res.json(search);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   PUT api/search/:id
// @desc    UPDATE search criteria
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('dealType', 'Укажите корректный тип сделки').isIn([
        'Продаю',
        'Сдаю'
      ]),
      check('searchType', 'Укажите корректный тип поиска')
        .if((val, { req }) => req.body.address)
        .isIn([
          'Поиск по адресу, району',
          'Поиск на карте города',
          'Поиск на карте метро'
        ]),
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
      check('houseType', 'Укажите корректный тип дома')
        .if((val, { req }) => val)
        .isIn(['Панельный', 'Блочный', 'Кирпичный', 'Монолит']),
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
        .custom(
          (val, { req }) => parseInt(val) >= parseInt(req.body.floorsFrom)
        ),
      check('elevator', 'Укажите наличие лифта')
        .if((val, { req }) => val)
        .isIn(['Нет', 'Пассажирский', 'Пассажирский и грузовой']),
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
        .custom(
          (val, { req }) => parseInt(val) >= parseInt(req.body.floorsFrom)
        ),
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
          (val, { req }) =>
            parseFloat(val) >= parseFloat(req.body.totalAreaFrom)
        ),
      check('livingAreaFrom', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val)
        .isFloat({ min: 0.1 }),
      check('livingAreaFrom', 'Укажите корректную жилую площадь')
        .if((val, { req }) => val && req.body.totalAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
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
          (val, { req }) =>
            parseFloat(val) >= parseFloat(req.body.livingAreaFrom)
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
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
        ),
      check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.body.totalAreaTo)
        .custom(
          (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
        ),
      check('kitchenAreaFrom', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.body.livingAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.body.livingAreaFrom)
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
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.body.totalAreaFrom)
        ),
      check('kitchenAreaTo', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.body.totalAreaTo)
        .custom(
          (val, { req }) => parseFloat(val) <= parseFloat(req.body.totalAreaTo)
        ),
      check('kitchenAreaTo', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.body.livingAreaFrom)
        .custom(
          (val, { req }) =>
            parseFloat(val) <= parseFloat(req.body.livingAreaFrom)
        ),
      check('kitchenAreaTo', 'Укажите корректную площадь кухни')
        .if((val, { req }) => val && req.body.livingAreaTo)
        .custom(
          (val, { req }) => parseFloat(val) <= parseFloat(req.body.livingAreaTo)
        ),
      check('balcony', 'Укажите корректные данные по балкону')
        .if((val, { req }) => val)
        .isIn(['Нет', 'Один', 'Два и более']),
      check('windows', 'Укажите корректные данные по окнам')
        .if((val, { req }) => val)
        .isIn(['На улицу', 'Во двор', 'На улицу и во двор']),
      check('cooker', 'Укажите корректный тип кухонной плиты')
        .if((val, { req }) => val)
        .isIn(['Электрическая', 'Газовая']),
      check('bathroom', 'Укажите корректный тип санузла')
        .if((val, { req }) => val)
        .isIn(['Совмещенный', 'Раздельный', 'Два и более']),
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
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      dealType,
      searchType,
      address,
      houseYearFrom,
      houseYearTo,
      houseType,
      floorsFrom,
      floorsTo,
      elevator,
      floorFrom,
      floorTo,
      floorExceptLast,
      roomsNumberFrom,
      roomsNumberTo,
      totalAreaFrom,
      totalAreaTo,
      livingAreaFrom,
      livingAreaTo,
      kitchenAreaFrom,
      kitchenAreaTo,
      balcony,
      windows,
      cooker,
      bathroom,
      priceFrom,
      priceTo
    } = req.body;

    try {
      let search = await Search.findById(req.params.id);

      if (!search) {
        return res.status(404).json({ msg: 'Критерии поиска не найдены' });
      }

      if (search.user.toString() !== req.user.id) {
        return res.status(401).json({
          msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
        });
      }

      search.user = req.user.id;
      if (name) search.name = name;
      if (dealType) search.dealType = dealType;
      if (searchType) search.searchType = searchType;
      if (address) search.address = address;
      if (houseYearFrom) search.houseYearFrom = houseYearFrom;
      if (houseYearTo) search.houseYearTo = houseYearTo;
      if (houseType) search.houseType = houseType;
      if (floorsFrom) search.floorsFrom = floorsFrom;
      if (floorsTo) search.floorsTo = floorsTo;
      if (elevator) search.elevator = elevator;
      if (floorFrom) search.floorFrom = floorFrom;
      if (floorTo) search.floorTo = floorTo;
      if (floorExceptLast) search.floorExceptLast = floorExceptLast;
      if (roomsNumberFrom) search.roomsNumberFrom = roomsNumberFrom;
      if (roomsNumberTo) search.roomsNumberTo = roomsNumberTo;
      if (totalAreaFrom) search.totalAreaFrom = totalAreaFrom;
      if (totalAreaTo) search.totalAreaTo = totalAreaTo;
      if (livingAreaFrom) search.livingAreaFrom = livingAreaFrom;
      if (livingAreaTo) search.livingAreaTo = livingAreaTo;
      if (kitchenAreaFrom) search.kitchenAreaFrom = kitchenAreaFrom;
      if (kitchenAreaTo) search.kitchenAreaTo = kitchenAreaTo;
      if (balcony) search.balcony = balcony;
      if (windows) search.windows = windows;
      if (cooker) search.cooker = cooker;
      if (bathroom) search.bathroom = bathroom;
      if (priceFrom) search.priceFrom = priceFrom;
      if (priceTo) search.priceTo = priceTo;

      await search.save();

      return res.json(search);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Критерии поиска не найдены' });
      }

      console.error(err.message);
      return res.status(500).json({ msg: 'Ошибка сервера' });
    }
  }
);

// @route   DELETE api/search/:id
// @desc    Delete search criteria
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const search = await Search.findById(req.params.id);

    if (!search) {
      return res.status(404).json({ msg: 'Критерии поиска не найдены' });
    }

    if (search.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Пользователь не имеет прав на изменение запрашиваемого ресурса'
      });
    }

    await search.remove();

    return res.json({ msg: 'Критерии поиска удалены' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Критерии поиска не найдены' });
    }

    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

module.exports = router;

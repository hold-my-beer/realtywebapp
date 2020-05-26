const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Province = require('../../models/Province');

// @route   GET api/provinces
// @desc    Get all provinces
// @access  Public
router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find().sort({ name: 1 });

    return res.json(provinces);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Ошибка сервера' });
  }
});

// @route   POST api/provinces
// @desc    Add new province
// @access  Private
// router.post(
//   '/',
//   [
//     auth,
//     [
//       check('province', 'Укажите наименование региона').not().isEmpty(),
//       check('locality', 'Укажите наименование населенного пункта')
//         .not()
//         .isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const { province, locality, district, route, metro } = req.body;

//     let newProvince = new Province();

//     if (province) newProvince.name = province;
//     if (locality) {
//       let newLocality = {};
//       newLocality.name = locality;

//       if (district) newLocality.districts.push({ name: district });
//       //   if (street) newLocality.streets.push({ name: street });
//       if (route && metro) {
//         newLocality.routes.push({ name: route, metros: [{ name: metro }] });
//       }

//       province.localities.push(newLocality);
//     }

//     try {
//       await province.save();

//       return res.json(province);
//     } catch (err) {
//       console.error(err.message);
//       return res.status(500).json({ msg: 'Ошибка сервера' });
//     }
//   }
// );

// @route   PUT api/provinces/:id
// @desc    Update province
// @access  Private
// router.put('/:id', auth, async (req, res) => {
//   try {
//     let province = await Province.findById(req.params.id);

//     if (!province) {
//       return res.status(404).json({ msg: 'Регион не найден' });
//     }

//     const { province, locality, district, route, metro } = req.body;

//     if (province) province.name = province;
//     if (locality) {
//       let foundLocality = false;
//       province.localities.forEach(localityItem => {
//         if (localityItem.name === locality) {
//           foundLocality = true;
//           // Check if district exists
//           if (district) {
//             const districtIndex = localityItem.districts
//               .map(districtItem => districtItem.name)
//               .indexOf(district);
//             if (districtIndex === -1) {
//               localityItem.districts.push({ name: district });
//             }
//           }

//           // Check if route and metro exist
//           if (route && metro) {
//             let foundRoute = false;
//             localityItem.routes.forEach(routeItem => {
//               if (routeItem.name === route) {
//                 foundRoute = true;
//                 const metroIndex = routeItem.metros
//                   .map(metroItem => metroItem.name)
//                   .indexOf(metro);
//                 if (metroIndex === -1) {
//                   routeItem.metros.push({ name: metro });
//                 }
//               }
//             });
//             if (!foundRoute) {
//               localityItem.routes.push({
//                 name: route,
//                 metros: [{ name: metro }]
//               });
//             }
//           }
//         }
//       });
//       if (!foundLocality) {
//         let newLocality = {};
//         newLocality.name = locality;

//         if (district) newLocality.districts.push({ name: district });
//         if (route && metro) {
//           newLocality.routes.push({ name: route, metros: [{ name: metro }] });
//         }

//         province.localities.push(newLocality);
//       }
//     }

//     await province.save();

//     return res.json(province);
//   } catch (err) {
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Регион не найден' });
//     }

//     console.error(err.message);
//     return res.status(500).json({ msg: 'Ошибка сервера' });
//   }
// });

module.exports = router;

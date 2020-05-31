const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String
  },
  dealType: {
    type: String,
    required: true
  },
  searchType: {
    type: String
  },
  province: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  addressDistricts: [
    {
      type: String
    }
  ],
  addressRoutes: [
    {
      type: String
    }
  ],
  addressMetros: [
    {
      type: String
    }
  ],
  metroDuration: {
    type: String
  },
  pedestrian: {
    type: Boolean
  },
  houseYearFrom: {
    type: Number
  },
  houseYearTo: {
    type: Number
  },
  // houseType: {
  //   type: [String]
  // },
  panel: {
    type: String
  },
  brick: {
    type: String
  },
  block: {
    type: String
  },
  monolithic: {
    type: String
  },
  floorsFrom: {
    type: Number
  },
  floorsTo: {
    type: Number
  },
  elevator: {
    type: String
  },
  floorFrom: {
    type: Number
  },
  floorTo: {
    type: Number
  },
  exceptLast: {
    type: Boolean
  },
  roomsNumberFrom: {
    type: Number
  },
  roomsNumberTo: {
    type: Number
  },
  totalAreaFrom: {
    type: Number
  },
  totalAreaTo: {
    type: Number
  },
  livingAreaFrom: {
    type: Number
  },
  livingAreaTo: {
    type: Number
  },
  kitchenAreaFrom: {
    type: Number
  },
  kitchenAreaTo: {
    type: Number
  },
  balcony: {
    type: String
  },
  windows: {
    type: String
  },
  cooker: {
    type: String
  },
  bathroom: {
    type: String
  },
  priceFrom: {
    type: Number
  },
  priceTo: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Search = mongoose.model('search', SearchSchema);

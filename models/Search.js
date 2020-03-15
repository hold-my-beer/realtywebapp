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
  address: {
    type: String
  },
  houseYearFrom: {
    type: Number
  },
  houseYearTo: {
    type: Number
  },
  houseType: {
    type: [String]
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
  floorExceptLast: {
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

const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  proposalPhotos: [
    {
      photoID: {
        type: String
      },
      photoURL: {
        type: String
      }
    }
  ],
  // proposalPhotos: {
  //   type: [String]
  // },
  dealType: {
    type: String,
    required: true
  },
  address: {
    // type: String,
    // required: true
    coords: {
      type: Array,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    locality: {
      type: String,
      required: true
    },
    street: {
      type: String
    },
    house: {
      type: String,
      required: true
    },
    metro: {
      type: String
    },
    route: {
      type: String
    },
    metroDuration: {
      auto: {
        value: {
          type: Number
        },
        text: {
          type: String
        }
      },
      masstransit: {
        value: {
          type: Number
        },
        text: {
          type: String
        }
      },
      pedestrian: {
        value: {
          type: Number
        },
        text: {
          type: String
        }
      }
    },
    district: {
      type: String
    },
    addressLine: {
      type: String,
      required: true
    },
    shortAddressLine: {
      type: String,
      required: true
    }
  },
  houseYear: {
    type: Number,
    required: true
  },
  houseType: {
    type: String,
    required: true
  },
  floors: {
    type: Number,
    required: true
  },
  elevator: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  isLastFloor: {
    type: Boolean,
    required: true
  },
  roomsNumber: {
    type: Number,
    required: true
  },
  totalArea: {
    type: Number,
    required: true
  },
  livingArea: {
    type: Number,
    required: true
  },
  kitchenArea: {
    type: Number,
    required: true
  },
  balcony: {
    type: String,
    required: true
  },
  windows: {
    type: String,
    required: true
  },
  cooker: {
    type: String,
    required: true
  },
  bathroom: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Proposal = mongoose.model('proposal', ProposalSchema);

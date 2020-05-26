const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  localities: [
    {
      name: {
        type: String,
        required: true
      },
      districts: [
        {
          name: {
            type: String,
            required: true
          }
        }
      ],
      //   streets: [
      //     {
      //       name: {
      //         type: String,
      //         required: true
      //       }
      //     }
      //   ],
      routes: [
        {
          name: {
            type: String,
            required: true
          },
          metros: [
            {
              name: {
                type: String,
                required: true
              }
            }
          ]
        }
      ]
    }
  ]
});

module.exports = Province = mongoose.model('province', ProvinceSchema);

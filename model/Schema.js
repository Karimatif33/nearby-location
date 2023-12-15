const mongoose = require("mongoose");
const { Schema } = mongoose;
const locationSchema = new mongoose.Schema(
    {
      name: String,
      lat: Number,
      lon: Number,
      priority: { type: Number, default: 1 },
      category: String,
      loc: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          index: '2dsphere',
        },
      },
    },
    {
      timestamps: true,
    }
  );

// model
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;

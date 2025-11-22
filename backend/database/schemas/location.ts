import mongoose from "mongoose";

export const LocationSchema = new mongoose.Schema({
  point: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords: number[]) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: "Coordinates must be [longitude, latitude]",
      },
    },
  },
  radius: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });


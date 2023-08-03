const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const regionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    population: {
      type: Number,
      default: null,
    }, 
    electricityUsage: {
      type: Number, 
      default: 0,
    },
    totalPower: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

regionSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "region",
});


const Region = mongoose.model("Region", regionSchema);

module.exports = Region;

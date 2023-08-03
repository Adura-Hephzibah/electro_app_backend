const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dateOfRequest: {
      type: Date,
      required: [true, "Please add a date"],
    },
    requestStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    message: { 
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;

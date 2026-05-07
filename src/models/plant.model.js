const mongoose = require("mongoose");

const wateringLogSchema = new mongoose.Schema(
  {
    wateredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    wateringTimesPerDay: {
      type: Number,
      required: true,
      default: 1,
    },

    wateringIntervalDays: {
      type: Number,
      required: true,
      default: 1,
    },

    nextWateringAt: {
      type: Date,
      required: true,
    },

    wateringLogs: {
      type: [wateringLogSchema],
      default: [],
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
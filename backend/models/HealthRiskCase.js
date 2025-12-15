const mongoose = require("mongoose");

const HealthRiskCaseSchema = new mongoose.Schema({
  pollutant: { type: String, required: true },
  medium: { type: String, required: true, enum: ["air", "water", "soil"] },

  C: { type: Number, required: true },
  IR: { type: Number, required: true },
  EF: { type: Number, required: true },
  ED: { type: Number, required: true },
  BW: { type: Number, required: true },
  AT: { type: Number, required: true },
  RfD: { type: Number, required: true },
  SF: { type: Number, required: true },

  CDI: { type: Number },
  HQ: { type: Number },
  CR: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HealthRiskCase", HealthRiskCaseSchema);

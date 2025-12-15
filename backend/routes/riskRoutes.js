const express = require("express");
const router = express.Router();
const HealthRiskCase = require("../models/HealthRiskCase");
const calculateHealthRisk = require("../utils/riskCalculator");

router.post("/calc", async (req, res) => {
  try {
    const inputData = req.body;

    const results = calculateHealthRisk(inputData);

    const newRecord = new HealthRiskCase({
      ...inputData,
      ...results,
    });

    await newRecord.save();

    res.status(200).json({
      success: true,
      data: newRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

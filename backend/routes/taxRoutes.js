const express = require("express");
const router = express.Router();
const { calculateTax } = require("../controllers/taxController");

router.post("/calculate", (req, res) => {
  console.log("📩 Received POST /api/tax/calculate");
  console.log("📝 Request Body:", req.body);

  calculateTax(req, res); // ✅ Call function correctly
});

module.exports = router;


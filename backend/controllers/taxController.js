const calculateTax = async (req, res) => {
  try {
    let { annualIncome, investments, deductions, otherIncome } = req.body;

    // Convert values to numbers
    annualIncome = Number(annualIncome);
    investments = Number(investments);
    deductions = Number(deductions);
    otherIncome = Number(otherIncome);

    // Validation: Check if any field is missing or NaN
    if (
      isNaN(annualIncome) ||
      isNaN(investments) ||
      isNaN(deductions) ||
      isNaN(otherIncome)
    ) {
      return res.status(400).json({ message: "Invalid input values." });
    }

    // Ensure taxable income is never negative
    let taxableIncome = Math.max(0, annualIncome + otherIncome - (investments + deductions));

    let taxPayable = 0;

    // Progressive tax calculation based on Indian tax slabs
    if (taxableIncome > 250000) {
      let remainingIncome = taxableIncome;

      // 5% tax on income between ₹2,50,001 - ₹5,00,000
      if (remainingIncome > 250000) {
        let slab = Math.min(remainingIncome - 250000, 250000);
        taxPayable += slab * 0.05;
        remainingIncome -= slab;
      }

      // 20% tax on income between ₹5,00,001 - ₹10,00,000
      if (remainingIncome > 250000) {
        let slab = Math.min(remainingIncome, 500000);
        taxPayable += slab * 0.2;
        remainingIncome -= slab;
      }

      // 30% tax on income above ₹10,00,000
      if (remainingIncome > 0) {
        taxPayable += remainingIncome * 0.3;
      }
    }

    // Format currency in INR
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(amount);
    };

    res.json({
      taxableIncome: formatCurrency(taxableIncome),
      taxPayable: formatCurrency(taxPayable)
    });

  } catch (error) {
    console.error("Error calculating tax:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { calculateTax };

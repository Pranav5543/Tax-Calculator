import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./styles.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const TaxForm = () => {
  const [userInput, setUserInput] = useState({
    annualIncome: "",
    investments: "",
    deductions: "",
    otherIncome: "",
  });
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/tax/calculate",
        userInput
      );
      setResult(data);
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
  };

  const handleReset = () => {
    setUserInput({
      annualIncome: "",
      investments: "",
      deductions: "",
      otherIncome: "",
    });
    setResult(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDownloadPDF = () => {
    const pdfContent = `
      Tax Calculation Report
      ---------------------
      Annual Income: ${userInput.annualIncome}
      Investments: ${userInput.investments}
      Deductions: ${userInput.deductions}
      Other Income: ${userInput.otherIncome}
      Taxable Income: ${result?.taxableIncome || "N/A"}
      Tax Payable: ${result?.taxPayable || "N/A"}
    `;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tax_calculation_report.pdf";
    link.click();
  };

  const taxData = result
    ? [
        { name: "Taxable Income", value: result.taxableIncome },
        { name: "Tax Payable", value: result.taxPayable },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div
      className={`app-container fixed-layout ${darkMode ? "dark-mode" : ""}`}
    >
      <div className="header-container">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, color: darkMode ? "#ff0000" : "#000" }}
        >
          Tax Portal
        </motion.h1>
        <motion.h2
          className="subtitle"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05, color: darkMode ? "#007bff" : "#000" }}
        >
          Check Your Tax Accurately
        </motion.h2>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      <div className="main-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="calculator-card"
        >
          <form onSubmit={handleSubmit} className="form-container">
            <input
              type="number"
              name="annualIncome"
              placeholder="Annual Income"
              value={userInput.annualIncome}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="investments"
              placeholder="Investments"
              value={userInput.investments}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="deductions"
              placeholder="Deductions"
              value={userInput.deductions}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="otherIncome"
              placeholder="Other Income"
              value={userInput.otherIncome}
              onChange={handleChange}
              required
            />
            <div className="button-container">
              <motion.button
                className="calculate-button"
                whileHover={{ backgroundColor: "#0056b3" }}
                whileTap={{ backgroundColor: "#004080" }}
                type="submit"
              >
                Calculate Tax
              </motion.button>
              <motion.button
                className="reset-button"
                whileHover={{ backgroundColor: "#5a6268" }}
                whileTap={{ backgroundColor: "#4a5258" }}
                type="button"
                onClick={handleReset}
              >
                Reset
              </motion.button>
            </div>
          </form>

          {result && (
            <motion.div
              className="result-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="result-title">Results</h2>
              <p className="result-text">
                Taxable Income: <span>{result.taxableIncome}</span>
              </p>
              <p className="result-text">
                Tax Payable: <span>{result.taxPayable}</span>
              </p>
              <button className="download-button" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="right-side-content">
          <motion.div
            className="tax-tips"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>Tax Tips</h3>
            <ul>
              <li>Maximize your deductions by keeping track of expenses.</li>
              <li>Invest in tax-saving schemes like ELSS or PPF.</li>
              <li>Claim HRA if you live in a rented accommodation.</li>
            </ul>
          </motion.div>

          {result && (
            <div className="tax-graph">
              <h3>Graphical Representation</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={taxData}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taxData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}

          <motion.div
            className="recent-updates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>Recent Tax Updates</h3>
            <ul>
              <li>New tax rebate for investments in renewable energy.</li>
              <li>
                Increased standard deduction limit for salaried individuals.
              </li>
              <li>Revised tax slabs for FY 2024–25.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TaxForm;

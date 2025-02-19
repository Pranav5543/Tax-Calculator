import React from "react";
import TaxForm from "../components/TaxForm";
import "./Home.css"; // Import a CSS file for Home component

const Home = () => {
  return (
    <div className="home" style={{ width: "100%" }}>
      <h1 className="welcome-text">Welcome to the Tax Calculation Portal</h1>
      <TaxForm />
    </div>
  );
};

export default Home;

import React from "react";
import RiskCalculator from "./components/RiskCalculator";

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Екологічний моніторинг
      </h1>
      <RiskCalculator />
    </div>
  );
}

export default App;

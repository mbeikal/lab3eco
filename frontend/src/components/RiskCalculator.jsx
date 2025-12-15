import React, { useState } from "react";
import axios from "axios";

const RiskCalculator = () => {
  const [formData, setFormData] = useState({
    pollutant: "PM2.5",
    medium: "air",
    C: "",
    IR: "",
    EF: "",
    ED: "",
    BW: "",
    AT: "",
    RfD: "",
    SF: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const generateSyntheticData = () => {
    const random = (min, max) => Math.random() * (max - min) + min;

    setFormData({
      pollutant: "Syntetic Pollutant X",
      medium: Math.random() > 0.5 ? "air" : "water",
      C: random(0.005, 0.25).toFixed(4),
      IR: random(8, 20).toFixed(2),
      EF: Math.floor(random(100, 350)),
      ED: Math.floor(random(1, 30)),
      BW: Math.floor(random(20, 90)),
      AT: Math.floor(random(365, 25 * 365)),
      RfD: random(1e-4, 1e-1).toExponential(2),
      SF: random(0.1, 20).toFixed(2),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, val]) =>
          ["pollutant", "medium"].includes(key)
            ? [key, val]
            : [key, parseFloat(val)]
        )
      );

      const response = await axios.post(
        "http://localhost:5000/api/risk/calc",
        payload
      );
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка розрахунку");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Оцінка ризику для здоров’я (В1)
      </h2>

      <button
        type="button"
        onClick={generateSyntheticData}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Згенерувати тестові дані
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Поля вводу */}
        <div>
          <label className="block text-sm font-bold">Забруднювач</label>
          <input
            name="pollutant"
            value={formData.pollutant}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold">Середовище</label>
          <select
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            className="border p-1 w-full"
          >
            <option value="air">Повітря</option>
            <option value="water">Вода</option>
          </select>
        </div>

        {["C", "IR", "EF", "ED", "BW", "AT", "RfD", "SF"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-bold">{field}</label>
            <input
              type="number"
              step="any"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="border p-1 w-full"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Розрахувати
        </button>
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">Результати:</h3>
          <p>
            <strong>Середня добова доза (CDI):</strong>{" "}
            {result.CDI.toExponential(4)} мг/(кг·добу)
          </p>
          <p>
            <strong>Неканцерогенний ризик (HQ):</strong> {result.HQ.toFixed(4)}
          </p>
          <p>
            <strong>Канцерогенний ризик (CR):</strong>{" "}
            {result.CR.toExponential(4)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {result.HQ > 1
              ? "⚠️ Ризик перевищено (HQ > 1)"
              : "✅ Ризик в межах норми (HQ < 1)"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;

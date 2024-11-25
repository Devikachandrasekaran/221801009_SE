import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setTableData([]);
    setPredictionResult(null);
    setError("");
    setMessage("");
  };

  // Train the model with the uploaded file
  const trainModel = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/train", formData);
      console.log("Model trained successfully!");
      setMessage(`Model trained successfully with accuracy: ${response.data.accuracy}`);
    } catch (error) {
      console.error("Error training the model:", error);
      setError("Error training the model. Please try again.");
    }
  };

  // Process the uploaded CSV file
  const handleFileUpload = () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;

      try {
        const rows = text.split("\n").map((row) => row.split(","));
        const headers = rows[0].map((header) => header.trim());
        const data = rows.slice(1).map((row) =>
          row.reduce((acc, value, index) => {
            acc[headers[index]] = value.trim();
            return acc;
          }, {})
        );

        // Convert categorical data to numeric in the frontend for consistency
        const deviceMapping = { WebMobile: 1, MobileWeb: 2 };
        const cityTierMapping = { Tier1: 1, Tier2: 2, Tier3: 3 };

        const convertedData = data.map((row) => ({
          ...row,
          PreferredLoginDevice: deviceMapping[row.PreferredLoginDevice] || row.PreferredLoginDevice,
          CityTier: cityTierMapping[row.CityTier] || row.CityTier,
        }));

        const requiredColumns = ["CustomerID", "Tenure", "PreferredLoginDevice", "CityTier", "OrderCount"];
        const filteredData = convertedData.map((row) =>
          Object.fromEntries(
            Object.entries(row).filter(([key]) => requiredColumns.includes(key))
          )
        );

        const trimmedData = filteredData.slice(0, 25);

        setTableData(trimmedData);
        setError("");
      } catch (err) {
        console.error("Error parsing CSV file:", err);
        setError("Failed to process the CSV file. Please check its format.");
      }
    };

    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };

    reader.readAsText(file);
  };

  // Submit data to backend for prediction
  const handleSubmit = async () => {
    if (tableData.length === 0) {
      setError("No valid data to submit. Please upload and process a file first.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        { data: tableData },
        { headers: { "Content-Type": "application/json" } }
      );
  
      setPredictionResult({
        predictions: response.data.predictions,
        total_risk_score: response.data.total_risk_score,
        risk_score_percentage: response.data.risk_score_percentage,
      });
  
      setMessage(`Total Risk Score: ${response.data.total_risk_score.toFixed(2)} | 
  Risk Score Percentage: ${response.data.risk_score_percentage.toFixed(2)}%`);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error sending data to the backend:", err);
      if (err.response) {
        setError(`Backend error: ${err.response.data.error || err.message}`);
      } else {
        setError("Failed to send data for prediction. Please try again.");
      }
    }
  };
  
  
  return (
    <div>
      <h1>File Upload for Churn Prediction</h1>

      {/* File upload input */}
      <input
  type="file"
  accept=".csv"
  onChange={handleFileChange}
  data-testid="file-input"
/>
      <button onClick={handleFileUpload}>Process File</button>
      <button onClick={trainModel}>Train Model</button>

      {/* Display errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Display table */}
      {tableData.length > 0 && (
        <div>
          <h2>Uploaded Data (Showing up to 25 rows)</h2>
          <table border="1">
            <thead>
              <tr>
                <th>CustomerID</th>
                <th>Tenure</th>
                <th>PreferredLoginDevice</th>
                <th>CityTier</th>
                <th>OrderCount</th>
                <th>Churn</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td>{row.CustomerID}</td>
                  <td>{row.Tenure}</td>
                  <td>{row.PreferredLoginDevice}</td>
                  <td>{row.CityTier}</td>
                  <td>{row.OrderCount}</td>
                  <td>{row.Churn}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit for Prediction</button>
        </div>
      )}

      {/* Display prediction results */}
      {/* Display risk scores */}
{/* Display prediction results */}
{/* {message && <p style={{ color: "blue", fontWeight: "bold" }}>{message}</p>}
{error && <p style={{ color: "red" }}>{error}</p>} */}

{predictionResult && (
  <div>
    <h2>Prediction Results</h2>
    <pre>{JSON.stringify(predictionResult, null, 2)}</pre>
    {/* {predictionResult.total_risk_score && predictionResult.risk_score_percentage && (
      <>
        <h3>Total Risk Score</h3>
        <p>Total Risk Score: {predictionResult.total_risk_score.toFixed(2)}</p>
        <p>Risk Score Percentage: {predictionResult.risk_score_percentage.toFixed(2)}%</p>
      </>
    )} */}
  </div>
)}


    </div>
  );
};

export default FileUpload;

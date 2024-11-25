import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";

const Dashboard = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insights");
        setInsights(response.data);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    fetchInsights();
  }, []);

  if (!insights) return <p>Loading insights...</p>;

  const pieData = {
    labels: ["Churn", "No Churn"],
    datasets: [
      {
        data: [insights.churn_rate, 100 - insights.churn_rate],
        backgroundColor: ["#ff6384", "#36a2eb"],
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Churn Rate: {insights.churn_rate.toFixed(2)}%</h3>
      <Pie data={pieData} />
      <h3>Confusion Matrix</h3>
      <pre>{JSON.stringify(insights.confusion_matrix, null, 2)}</pre>
      <h3>Top Features</h3>
      <ul>
        {insights.top_features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

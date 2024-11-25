import React from "react";

const Insights = ({ report }) => (
  <div>
    <h2>Classification Report</h2>
    <pre>{JSON.stringify(report, null, 2)}</pre>
  </div>
);

export default Insights;

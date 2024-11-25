import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import UploadPage from "./Pages/UploadPage";
import DashboardPage from "./Pages/DashboardPage";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  </Router>
);

export default App;

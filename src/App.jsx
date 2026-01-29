// src/App.jsx or wherever your Routes are defined
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Optional: redirect unknown paths */}
        <Route path="*" element={<Login />} />
      </Routes>
    
  );
}

export default App;

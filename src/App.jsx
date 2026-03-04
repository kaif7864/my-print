import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import IDForm from "./services/Pan";
import PrintListPage from "./components/PrintList";
import WalletPage from "./components/WalletPage";
import AddMoneyPage from "./components/AddMoneyPage";
import ComingSoonPage from "./components/ComingSoonPage";
import NotforYou from "./services/marksheets/MarksheetSelection";
        // App.js mein imports check karein
import MarksheetSelection from "./services/marksheets/MarksheetSelection";
import MarksheetForm from "./services/marksheets/MarksheetForm"; // Isko import karein
import AadhaarExtractor from "./services/aadhaar/AadhaarExtractor"; // Isko import karein

// 🔥 Protected Route Wrapper Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Agar authenticated nahi hai, login page par bhejo
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
    // 🛡️ Extra security: Token bhi clear karein
    localStorage.removeItem("token"); 
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🛡️ Protected Routes Wrapper */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/generate/:serviceType"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <IDForm />
            </ProtectedRoute>
          }
        />
        
        {/* Baki routes ke liye bhi yahi wrapper use karein */}
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
        <Route path="/print-list" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PrintListPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute isAuthenticated={isAuthenticated}><WalletPage /></ProtectedRoute>} />
        <Route path="/add-money" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AddMoneyPage /></ProtectedRoute>} />
        <Route path="/coming-soon" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ComingSoonPage /></ProtectedRoute>} />
        <Route path="/not-for-you" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NotforYou /></ProtectedRoute>} />
        <Route path="/generate-marksheet" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NotforYou /></ProtectedRoute>} />
        <Route path="/marksheet-selection" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MarksheetSelection /></ProtectedRoute>} />
        <Route path="/generate-marksheet/:type" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MarksheetForm /></ProtectedRoute>} />
        <Route path="/aadhar" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AadhaarExtractor /></ProtectedRoute>} /> 



<Route path="/marksheet-selection" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MarksheetSelection /></ProtectedRoute>} />
<Route path="/generate-marksheet/:type" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MarksheetForm /></ProtectedRoute>} />

        {/* 404 handler */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
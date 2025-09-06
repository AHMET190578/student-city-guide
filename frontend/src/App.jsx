import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CityDetail from "./pages/CityDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import QAPage from "./pages/QAPage"; // veya "./pages/QAPages" dosya adına göre

// import Category from "./pages/Category"; // <-- SİL

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:id" element={<CityDetail />} />
        {/* <Route path="/category/:category" element={<Category />} /> <-- SİL */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Home />}
        />
        <Route path="/q-a" element={<QAPage />} />
      </Routes>
    </div>
  );
}

export default App;

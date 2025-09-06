import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">Ana Sayfa</Link>
      {!user && <Link to="/login">Giriş</Link>}
      {!user && <Link to="/signup">Kayıt Ol</Link>}
      {user && (
        <>
          <Link to="/dashboard">Panel</Link>
          <span>Hoşgeldin, {user.username}!</span>
          <button onClick={handleLogout}>Çıkış</button>
        </>
      )}
    </nav>
  );
}

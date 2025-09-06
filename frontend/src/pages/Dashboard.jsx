import React from "react";

export default function Dashboard({ user }) {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Kullanıcı Paneli</h2>
      <ul>
        <li>Kullanıcı Adı: {user.username}</li>
        <li>E-posta: {user.email}</li>
        <li>Rol: {user.role}</li>
      </ul>
      <p>Hoşgeldin! Giriş yaptın.</p>
    </div>
  );
}

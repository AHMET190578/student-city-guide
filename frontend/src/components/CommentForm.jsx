import React, { useState } from "react";

export default function CommentForm({ onAddComment }) {
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.text || !form.rating) {
      setError("Tüm alanlar zorunlu.");
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      setError("Puan 1 ile 5 arasında olmalı.");
      return;
    }
    await onAddComment(form);
    setForm({ name: "", text: "", rating: 5 });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Adınız"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Yorumunuz"
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="number"
        placeholder="Puan (1-5)"
        min={1}
        max={5}
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        required
        style={{ marginRight: 8, width: 60 }}
      />
      <button type="submit">Yorum Ekle</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

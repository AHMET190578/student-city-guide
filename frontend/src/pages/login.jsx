import React, { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await login(form);
    if (data.user) {
      setUser(data.user);
      navigate("/");
    } else {
      setError(data.message || "Giriş başarısız.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginBox}>
        <div style={styles.logo}>
          <i className="fas fa-lock" style={styles.lockIcon}></i>
        </div>
        <h2 style={styles.heading}>Giriş Yap</h2>
        <p style={styles.subheading}>Hesabınıza erişin ve yönetin.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>E-posta</label>
          <input
            type="email"
            value={form.email}
            placeholder="ornek@mail.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={styles.input}
          />
          <label style={styles.label}>Şifre</label>
          <input
            type="password"
            value={form.password}
            placeholder="••••••••"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>
            <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>
            Giriş Yap
          </button>
        </form>
        <p style={styles.footer}>
          Hesabın yok mu?{" "}
          <Link to="/signup" style={styles.link}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg, #1e293b, #334155)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  loginBox: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    textAlign: "center",
  },
  logo: {
    backgroundColor: "#2563eb",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    color: "#fff",
    fontSize: "24px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#111827",
  },
  subheading: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  form: {
    textAlign: "left",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "16px",
    marginTop: "-8px",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "24px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: 4,
  },
};

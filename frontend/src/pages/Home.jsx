import React, { useEffect, useState } from "react";
import { getLocations, filterLocations, getTopRatedPlaces } from "../api";
import { Link, useNavigate } from "react-router-dom";
import Chatbot from "../components/chatbot.jsx";

export default function Home() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [cityName, setCityName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [showTopRated, setShowTopRated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getLocations().then((data) => {
      setCities(data);
      setLoading(false);
    });
  }, []);

  const handleFilterAll = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFiltering(true);
    const data = await filterLocations({
      category: category.trim(),
      cityName: cityName.trim(),
      universityName: universityName.trim(),
    });
    setCities(data);
    setLoading(false);
  };

  const handleFilterTopRated = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFiltering(true);
    let data = await getTopRatedPlaces();

    if (category) {
      data = data.filter(
        (item) => item.categories && item.categories.includes(category.trim())
      );
    }
    if (cityName) {
      data = data.filter(
        (item) =>
          item.cityName &&
          item.cityName.toLowerCase().trim() === cityName.toLowerCase().trim()
      );
    }
    if (universityName) {
      data = data.filter(
        (item) =>
          item.universityName &&
          item.universityName.toLowerCase().trim() ===
            universityName.toLowerCase().trim()
      );
    }

    setCities(data);
    setLoading(false);
  };

  const handleShowTopRated = async () => {
    setLoading(true);
    setShowTopRated(true);
    let data = await getTopRatedPlaces();

    if (category || cityName || universityName) {
      if (category) {
        data = data.filter(
          (item) => item.categories && item.categories.includes(category.trim())
        );
      }
      if (cityName) {
        data = data.filter(
          (item) =>
            item.cityName &&
            item.cityName.toLowerCase().trim() === cityName.toLowerCase().trim()
        );
      }
      if (universityName) {
        data = data.filter(
          (item) =>
            item.universityName &&
            item.universityName.toLowerCase().trim() ===
              universityName.toLowerCase().trim()
        );
      }
    }

    setCities(data);
    setLoading(false);
    setFiltering(false);
  };

  const handleShowAll = async () => {
    setLoading(true);
    setShowTopRated(false);

    let data;
    if (category || cityName || universityName) {
      data = await filterLocations({
        category: category.trim(),
        cityName: cityName.trim(),
        universityName: universityName.trim(),
      });
    } else {
      data = await getLocations();
    }

    setCities(data);
    setLoading(false);
    setFiltering(false);
  };

  const handleClearFilters = async () => {
    setLoading(true);
    setCategory("");
    setCityName("");
    setUniversityName("");
    let data;
    if (showTopRated) {
      data = await getTopRatedPlaces();
    } else {
      data = await getLocations();
    }
    setCities(data);
    setLoading(false);
    setFiltering(false);
  };

  const handleFilter = showTopRated ? handleFilterTopRated : handleFilterAll;

  return (
    <>
      <div
        style={{
          maxWidth: 960,
          margin: "40px auto",
          padding: "24px",
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          {showTopRated ? "⭐ En İyi Yerler" : "📍 Tüm Şehirler ve Lokasyonlar"}
        </h2>

        {/* Butonlar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            onClick={handleShowAll}
            disabled={!showTopRated && !filtering}
            style={{
              padding: "10px 20px",
              background: !showTopRated && !filtering ? "#2563eb" : "#fff",
              color: !showTopRated && !filtering ? "#fff" : "#111827",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Tüm Yerler
          </button>
          <button
            onClick={handleShowTopRated}
            disabled={showTopRated}
            style={{
              padding: "10px 20px",
              background: showTopRated ? "#2563eb" : "#fff",
              color: showTopRated ? "#fff" : "#111827",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            En İyi Yerler
          </button>
          <button
            onClick={() => navigate("/q-a")}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Soru-Cevap
          </button>
        </div>

        {/* Filtreleme */}
        <form
          onSubmit={handleFilter}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <input
            type="text"
            placeholder="Kategori (örn: eğlence, müze...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              minWidth: 200,
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
          <input
            type="text"
            placeholder="Şehir (örn: İstanbul)"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              minWidth: 200,
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
          <input
            type="text"
            placeholder="Üniversite (örn: Yıldız Teknik)"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              minWidth: 200,
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            Filtrele
          </button>
          {(filtering || category || cityName || universityName) && (
            <button
              type="button"
              style={{
                padding: "10px 20px",
                background: "#e5e7eb",
                color: "#111827",
                border: "none",
                borderRadius: "6px",
                fontWeight: 500,
                cursor: "pointer",
                minWidth: 120,
              }}
              onClick={handleClearFilters}
            >
              Temizle
            </button>
          )}
        </form>

        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
            Yükleniyor...
          </div>
        ) : cities && cities.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cities.map((city, idx) => (
              <li
                key={city.placeId || city._id || idx}
                style={{
                  marginBottom: 18,
                  padding: "16px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Link
                  to={`/city/${city.placeId || city._id}`}
                  style={{
                    textDecoration: "none",
                    color: "#2563eb",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {city.cityName} - {city.universityName} - {city.placeName}
                </Link>
                <div style={{ marginTop: 4 }}>{city.description}</div>
                {city.images && city.images.length > 0 && (
                  <img
                    src={city.images[0]}
                    alt={city.placeName}
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      marginTop: 12,
                      borderRadius: "8px",
                    }}
                  />
                )}
                {showTopRated && (
                  <div style={{ marginTop: 8, color: "#111827" }}>
                    ⭐ Ortalama Puan: <b>{city.averageRating}</b> (
                    {city.totalComments} yorum)
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
            {showTopRated
              ? "Yeterli puan almış yer bulunamadı."
              : "Filtreye uygun şehir bulunamadı."}
          </div>
        )}
      </div>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}

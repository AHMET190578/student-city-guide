import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCityDetail, addComment } from "../api";
import CommentForm from "../components/CommentForm";

export default function CityDetail() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCityDetail(id).then((data) => {
      setCity(data.city);
      setComments(data.comments);
      setLoading(false);
    });
  }, [id]);

  const handleAddComment = async (comment) => {
    const newComment = await addComment(id, comment);
    setComments([newComment, ...comments]);
  };

  if (loading)
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "18px",
        }}
      >
        Yükleniyor...
      </div>
    );

  if (!city)
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "#ef4444",
          fontSize: "18px",
        }}
      >
        Şehir bulunamadı.
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ fontSize: "26px", fontWeight: "600", marginBottom: "16px" }}>
        {city.cityName} - {city.placeName}
      </h2>

      <div style={{ fontSize: "16px", color: "#374151", marginBottom: 8 }}>
        <strong>🎓 Üniversite:</strong> {city.universityName}
      </div>
      <div style={{ fontSize: "16px", color: "#374151", marginBottom: 8 }}>
        <strong>📄 Açıklama:</strong> {city.description}
      </div>
      <div style={{ fontSize: "16px", color: "#374151", marginBottom: 16 }}>
        <strong>📍 Konum:</strong> {city.location}
      </div>

      {city.images && city.images.length > 0 && (
        <img
          src={city.images[0]}
          alt={city.placeName}
          style={{
            width: "100%",
            maxWidth: 500,
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        />
      )}

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e7eb",
          margin: "32px 0",
        }}
      />

      <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: 12 }}>
        💬 Yorumlar
      </h3>

      <CommentForm onAddComment={handleAddComment} />

      {comments.length === 0 ? (
        <p style={{ marginTop: 16, color: "#6b7280" }}>
          Henüz yorum yapılmamış. İlk sen yaz!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 24 }}>
          {comments.map((comment) => (
            <li
              key={comment._id}
              style={{
                padding: "16px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontWeight: "600", color: "#111827" }}>
                {comment.name}{" "}
                <span style={{ fontWeight: "normal", color: "#9ca3af" }}>
                  ({comment.rating}/5)
                </span>
              </div>
              <p style={{ marginTop: 8, color: "#374151" }}>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

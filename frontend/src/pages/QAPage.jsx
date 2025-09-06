import React, { useEffect, useState, useCallback } from "react";
import { getQuestions, askQuestion, getAnswers, answerQuestion } from "../api";

export default function QAPage() {
  const [universityName, setUniversityName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Yeni soru ekleme
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showAskForm, setShowAskForm] = useState(false);

  // Cevap görüntüleme ve ekleme
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  // Soru çekme - Üniversite seçildiğinde otomatik çalışır
  const fetchQuestions = useCallback(async () => {
    if (!universityName.trim()) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    try {
      // Backend'deki getQuestions fonksiyonunu GET parametresi ile çağır
      const data = await getQuestions(universityName.trim());
      setQuestions(data || []);
    } catch (error) {
      console.error("Sorular getirilirken hata:", error);
      setQuestions([]);
    }
    setLoading(false);
  }, [universityName]);

  useEffect(() => {
    if (universityName.trim()) {
      fetchQuestions();
    } else {
      setQuestions([]);
      setSelectedQuestion(null);
      setAnswers([]);
    }
  }, [universityName, fetchQuestions]);

  // Soru ekle
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !universityName.trim()) {
      alert("Lütfen soru başlığını ve üniversite adını doldurun!");
      return;
    }

    try {
      console.log("Soru gönderiliyor:", {
        title: newTitle.trim(),
        body: newBody.trim(),
        universityName: universityName.trim(),
      });

      const result = await askQuestion({
        title: newTitle.trim(),
        body: newBody.trim(),
        universityName: universityName.trim(),
      });

      console.log("Soru gönderildi:", result);

      setNewTitle("");
      setNewBody("");
      setShowAskForm(false);
      fetchQuestions(); // Soruları yenile
      alert("Soru başarıyla gönderildi!");
    } catch (error) {
      console.error("Soru gönderilirken hata:", error);
      alert("Soru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Cevapları getir veya gizle
  const toggleAnswers = async (questionId) => {
    // Eğer aynı sorunun cevapları açıksa, kapat
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
      setAnswers([]);
      return;
    }

    setSelectedQuestion(questionId);
    setLoadingAnswers(true);
    try {
      const data = await getAnswers(questionId);
      setAnswers(data || []);
    } catch (error) {
      console.error("Cevaplar getirilirken hata:", error);
      setAnswers([]);
    }
    setLoadingAnswers(false);
  };

  // Cevap ekle
  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      await answerQuestion(selectedQuestion, newAnswer.trim());
      setNewAnswer("");
      // Cevapları yenile
      const data = await getAnswers(selectedQuestion);
      setAnswers(data || []);
    } catch (error) {
      console.error("Cevap gönderilirken hata:", error);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 32 }}>
        Soru-Cevap Platformu
      </h2>

      {/* Üniversite seçimi */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <input
          type="text"
          placeholder="Üniversite adı girin (örn: Yıldız Teknik Üniversitesi)"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          style={{
            padding: 12,
            width: "100%",
            maxWidth: 400,
            marginBottom: 16,
            border: "2px solid #ddd",
            borderRadius: 8,
            fontSize: 16,
          }}
        />

        <button
          onClick={() => setShowAskForm(!showAskForm)}
          disabled={!universityName.trim()}
          style={{
            padding: "12px 24px",
            backgroundColor: universityName.trim() ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: universityName.trim() ? "pointer" : "not-allowed",
            fontSize: 16,
          }}
        >
          {showAskForm ? "İptal" : "Yeni Soru Sor"}
        </button>
      </div>

      {/* Üniversite bilgisi */}
      {universityName.trim() && (
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            padding: 12,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
          }}
        >
          <strong>{universityName}</strong> üniversitesi için sorular
        </div>
      )}

      {/* Soru ekleme formu */}
      {showAskForm && universityName.trim() && (
        <form
          onSubmit={handleAskQuestion}
          style={{
            margin: "24px 0",
            padding: 20,
            border: "2px solid #007bff",
            borderRadius: 8,
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Yeni Soru Sor</h3>
          <input
            type="text"
            name="title"
            placeholder="Soru başlığı"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
          <textarea
            name="body"
            placeholder="Soru detayları (isteğe bağlı)"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 12,
              minHeight: 100,
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 16,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            style={{
              padding: "12px 24px",
              backgroundColor: newTitle.trim() ? "#28a745" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: newTitle.trim() ? "pointer" : "not-allowed",
              fontSize: 16,
            }}
          >
            Soruyu Gönder
          </button>
        </form>
      )}

      {/* Loading durumu */}
      {loading && (
        <div style={{ textAlign: "center", padding: 20 }}>
          Sorular yükleniyor...
        </div>
      )}

      {/* Sorular listesi */}
      {questions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Sorular ({questions.length})</h3>
          {questions.map((q) => (
            <div
              key={q._id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                marginBottom: 16,
                borderRadius: 8,
                backgroundColor:
                  selectedQuestion === q._id ? "#f0f8ff" : "white",
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                  {q.title}
                </h4>
                {q.body && (
                  <p style={{ margin: "0 0 8px 0", color: "#666" }}>{q.body}</p>
                )}
                <small style={{ color: "#999" }}>
                  {q.createdAt && new Date(q.createdAt).toLocaleString("tr-TR")}
                </small>
              </div>

              <button
                onClick={() => toggleAnswers(q._id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    selectedQuestion === q._id ? "#dc3545" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {selectedQuestion === q._id
                  ? "Cevapları Gizle"
                  : "Cevapları Gör"}
              </button>

              {/* Cevaplar bölümü */}
              {selectedQuestion === q._id && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 4,
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0" }}>Cevaplar</h4>

                  {loadingAnswers && (
                    <div style={{ textAlign: "center", padding: 12 }}>
                      Cevaplar yükleniyor...
                    </div>
                  )}

                  {!loadingAnswers && answers.length > 0 ? (
                    <div style={{ marginBottom: 16 }}>
                      {answers.map((a) => (
                        <div
                          key={a._id}
                          style={{
                            padding: 12,
                            marginBottom: 8,
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: 4,
                          }}
                        >
                          <div style={{ marginBottom: 4 }}>{a.text}</div>
                          <small style={{ color: "#666" }}>
                            {a.user?.username ? `${a.user.username} • ` : ""}
                            {a.createdAt &&
                              new Date(a.createdAt).toLocaleString("tr-TR")}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !loadingAnswers && (
                      <div
                        style={{
                          padding: 12,
                          textAlign: "center",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        Henüz cevap yok. İlk cevabı sen ver!
                      </div>
                    )
                  )}

                  {/* Cevap ekleme formu */}
                  <form onSubmit={handleAnswer}>
                    <textarea
                      placeholder="Cevabınızı yazın..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        marginBottom: 8,
                        padding: 12,
                        minHeight: 80,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        fontSize: 14,
                        resize: "vertical",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Cevapla
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Soru bulunamadı durumu */}
      {!loading && questions.length === 0 && universityName.trim() && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "#666",
            fontStyle: "italic",
          }}
        >
          <p>{universityName} üniversitesi için henüz soru bulunmuyor.</p>
          <p>
            İlk soruyu sormak için yukarıdaki "Yeni Soru Sor" butonuna tıklayın.
          </p>
        </div>
      )}
    </div>
  );
}

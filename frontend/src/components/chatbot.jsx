import React, { useState, useRef, useEffect } from "react";
import { chatWithBot } from "../api.js";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chatbot'u ilk açtığında hoş geldin mesajı
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Merhaba! Size nasıl yardımcı olabilirim? Şehirler, lokasyonlar, üniversiteler hakkında sorularınızı yanıtlayabilirim.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatWithBot(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: response.reply || "Özür dilerim, bir hata oluştu.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Özür dilerim, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Merhaba! Size nasıl yardımcı olabilirim? Şehirler, lokasyonlar, üniversiteler hakkında sorularınızı yanıtlayabilirim.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,123,255,0.4)",
          zIndex: 1000,
          color: "white",
          fontSize: "24px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#0056b3";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#007bff";
          e.target.style.transform = "scale(1)";
        }}
      >
        {isOpen ? "✕" : "💬"}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: "16px" }}>Yardım Asistanı</h4>
              <small style={{ opacity: 0.9 }}>Online</small>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={clearChat}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  padding: "5px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Temizle
              </button>
              <button
                onClick={toggleChat}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  padding: "5px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 12px",
                    borderRadius: "18px",
                    backgroundColor:
                      message.sender === "user" ? "#007bff" : "#f1f1f1",
                    color: message.sender === "user" ? "white" : "#333",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "18px",
                    backgroundColor: "#f1f1f1",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Yazıyor...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "15px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor:
                  isLoading || !inputMessage.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isLoading || !inputMessage.trim() ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// backend/services/cohere.service.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const askCohere = async (message) => {
  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-r-plus",
      message,
    }),
  });

  const data = await response.json();
  return data.text || data.reply || "Cevap alınamadı.";
};

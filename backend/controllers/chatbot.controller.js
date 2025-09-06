// backend/controllers/chatbot.controller.js
import { askCohere } from "../services/cohere.service.js";

export const chatWithBot = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Mesaj eksik." });
  }

  try {
    const reply = await askCohere(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot hatası:", error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
};

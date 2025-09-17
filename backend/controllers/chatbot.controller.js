// backend/controllers/chatbot.controller.js
import { askCohere } from "../services/cohere.service.js";

export const chatWithBot = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const reply = await askCohere(message);
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Chatbot error" });
  }
};

import express from "express";
import {
  askSomething,
  answerQuestion,
  getQuestions,
  getAnswers,
} from "../controllers/q-a.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/ask", protect, askSomething);
router.post("/answer/:questionId", protect, answerQuestion);
// GET request olarak değiştir
router.get("/questions", getQuestions);
router.get("/answers/:questionId", getAnswers);

export default router;

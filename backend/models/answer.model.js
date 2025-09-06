// models/answer.model.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;

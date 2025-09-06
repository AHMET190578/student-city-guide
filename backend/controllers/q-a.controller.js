import Answer from "../models/answer.model.js";
import Question from "../models/questions.model.js";

export const askSomething = async (req, res) => {
  try {
    const { title, body, universityName } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user

    if (!title || !universityName) {
      return res
        .status(400)
        .json({ message: "Title and university name are required." });
    }

    const question = new Question({
      title,
      body,
      user: userId,
      universityName,
    });

    await question.save();
    res.status(201).json({ message: "Question asked successfully.", question });
  } catch (error) {
    console.error("Error asking question:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user

    if (!text) {
      return res.status(400).json({ message: "Answer text is required." });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const answer = new Answer({
      text,
      question: questionId,
      user: userId,
    });

    await answer.save();
    res.status(201).json({ message: "Answer added successfully.", answer });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getQuestions = async (req, res) => {
  // Query parametresinden al (GET request için)
  const { universityName } = req.query;

  try {
    if (!universityName) {
      return res.status(400).json({ message: "University name is required." });
    }

    const questions = await Question.find({ universityName })
      .populate("user", "username")
      .sort({ createdAt: -1 }); // En yeni sorular üstte

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ question: questionId })
      .populate("user", "username")
      .sort({ createdAt: 1 });
    if (!answers || answers.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this question." });
    }
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch answers" });
  }
};

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Fallback high-quality static question pool for uninterrupted gameplay (broken down by age group)
const FALLBACK_QUESTIONS: Array<{
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  ageGroup: "Child" | "Teen" | "Adult";
  difficulty: string;
  explanationHint: string;
}> = [
  // Child Category
  {
    id: "child-sci-1",
    question: "Why do leaves on plants look green?",
    options: [
      "Because they absorb green sunlight",
      "Because they contain chlorophyll",
      "Because they are painted by insects",
      "Because of the dust in the garden"
    ],
    correctIndex: 1,
    category: "Science",
    ageGroup: "Child",
    difficulty: "Easy",
    explanationHint: "Chlorophyll is a special pigment in plant cells that captures light for food and reflects beautiful green wavelengths."
  },
  {
    id: "child-gk-1",
    question: "How many continents are there on planet Earth?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    category: "General Knowledge",
    ageGroup: "Child",
    difficulty: "Easy",
    explanationHint: "The world has 7 majestic landmasses named Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
  },
  {
    id: "child-ai-1",
    question: "What is an algorithm in simple words?",
    options: [
      "A musical instrument",
      "A set of step-by-step instructions to solve a problem",
      "An electronic battery",
      "A computer screen"
    ],
    correctIndex: 1,
    category: "Tech & AI",
    ageGroup: "Child",
    difficulty: "Medium",
    explanationHint: "An algorithm is like a baking recipe! It guides a computer step-by-step to get the perfect result."
  },
  {
    id: "child-gk-2",
    question: "Which solar system planet is known for its beautiful rings?",
    options: ["Mars", "Saturn", "Neptune", "Mercury"],
    correctIndex: 1,
    category: "General Knowledge",
    ageGroup: "Child",
    difficulty: "Easy",
    explanationHint: "Saturn has wide, spectacular rings made of shiny ice, rocky debris, and cosmic dust particles!"
  },
  {
    id: "child-sci-2",
    question: "What state of matter is water vapor?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    correctIndex: 2,
    category: "Science",
    ageGroup: "Child",
    difficulty: "Easy",
    explanationHint: "Water vapor is gas! When water heats up, its tiny molecules spread apart and rise into the air."
  },

  // Teen Category (13-18)
  {
    id: "teen-sci-1",
    question: "What makes Quantum Computing different from classical computing?",
    options: [
      "Quantum computers use bits that must be strictly 0 or 1",
      "Quantum computers use qubits which can exist in superpositions representing 0 and 1 simultaneously",
      "Quantum computers only work in dark rooms without lights",
      "Quantum computers are just standard computers running faster cycles"
    ],
    correctIndex: 1,
    category: "Tech & AI",
    ageGroup: "Teen",
    difficulty: "Medium",
    explanationHint: "Under superposition, qubits can encode massive combinations of data simultaneously, boosting specific complex problems."
  },
  {
    id: "teen-gk-1",
    question: "Who was the first emperor of the Roman Empire, ruling from 27 BC until 14 AD?",
    options: ["Julius Caesar", "Nero", "Augustus", "Marcus Aurelius"],
    correctIndex: 2,
    category: "History",
    ageGroup: "Teen",
    difficulty: "Hard",
    explanationHint: "Augustus Caesar, formerly Octavian, initiated the peaceful Pax Romana era after the fall of the republic."
  },
  {
    id: "teen-ai-1",
    question: "In Machine Learning, what is 'Overfitting'?",
    options: [
      "When a computer case gets too hot",
      "When a model performs exceptionally on training data but poorly on unseen test data",
      "Using too many training images",
      "An algorithm running out of local RAM"
    ],
    correctIndex: 1,
    category: "Tech & AI",
    ageGroup: "Teen",
    difficulty: "Medium",
    explanationHint: "Overfitting means the model memorized the training data's noise rather than learning general patterns."
  },
  {
    id: "teen-sci-2",
    question: "Which chemical element has the symbol 'Fe'?",
    options: ["Fluorine", "Iron", "Fermium", "Lead"],
    correctIndex: 1,
    category: "Science",
    ageGroup: "Teen",
    difficulty: "Easy",
    explanationHint: "Fe comes from 'Ferrum', the Latin word for Iron, which is a strong, magnetic metal transition element."
  },
  {
    id: "teen-gk-2",
    question: "The Magna Carta was signed by King John of England in which historic year?",
    options: ["1066", "1215", "1492", "1776"],
    correctIndex: 1,
    category: "History",
    ageGroup: "Teen",
    difficulty: "Hard",
    explanationHint: "The Magna Carta was signed in 1215 at Runnymede, limiting the arbitrary power of the crown for the first time."
  },

  // Adult Category (19+)
  {
    id: "adult-sci-1",
    question: "What is quantum entanglement sometimes colloquially referred to as?",
    options: [
      "Retrograde molecular action",
      "Newtonian synchronization",
      "Spooky action at a distance",
      "Relativistic photon alignment"
    ],
    correctIndex: 2,
    category: "Science",
    ageGroup: "Adult",
    difficulty: "Hard",
    explanationHint: "Albert Einstein famously called it 'spooky action at a distance' because state measurement affects the pair instantly regardless of physical distance."
  },
  {
    id: "adult-ai-1",
    question: "What core mechanism did the revolutionary 2017 paper 'Attention Is All You Need' introduce to improve NLP?",
    options: [
      "Recurrent Neural Gates",
      "Self-Attention (Transformer architecture)",
      "Convolutional Overlays",
      "Stochastic Gradient Descents"
    ],
    correctIndex: 1,
    category: "Tech & AI",
    ageGroup: "Adult",
    difficulty: "Hard",
    explanationHint: "The Transformer's self-attention mechanism processes all tokens of sequence simultaneously, solving long-range dependencies."
  },
  {
    id: "adult-gk-1",
    question: "Which philosophical school, founded in Athens by Zeno of Citium, values emotional resilience, reason, and accepting virtue?",
    options: ["Epicureanism", "Stoicism", "Hedonism", "Skepticism"],
    correctIndex: 1,
    category: "Philosophy",
    ageGroup: "Adult",
    difficulty: "Medium",
    explanationHint: "Stoicism emphasizes focus on what is within our control, accepting fate with equanimity, and matching actions to reason."
  },
  {
    id: "adult-sci-2",
    question: "What does the 'Hawking Radiation' theory state about Black Holes?",
    options: [
      "They grow instantly when light strikes them",
      "They emit thermal radiation due to quantum effects near the event horizon, eventually evaporating",
      "They bounce cosmic rays back into the solar wind",
      "They are entirely cold and can never leak energy"
    ],
    correctIndex: 1,
    category: "Science",
    ageGroup: "Adult",
    difficulty: "Hard",
    explanationHint: "Stephen Hawking showed black holes lose mass through quantum particle-antiparticle fluctuations at the horizon, eventually evaporating."
  }
];

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// ENDLESS QUIZ QUESTION GENERATOR
app.post("/api/quiz/generate-question", async (req, res) => {
  const { category, ageGroup, excludeList } = req.body;
  const targetAge: "Child" | "Teen" | "Adult" = ageGroup || "Teen";
  const targetCategory = category || "General Knowledge";
  const excludes: string[] = excludeList || [];

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Generate ONE highly engaging, accurate Multiple Choice Question (MCQ) for a user studying in the category "${targetCategory}" rated for a "${targetAge}" user group (Child: age 6-12 simple/fun, Teen: age 13-18 moderate/intriguing, Adult: age 19+ advanced/deep). 
      To ensure the game is unique, the generated question MUST NOT be in this list of questions that have recently been answered in this session: [${excludes.join(", ")}].
      Ensure the incorrect options are plausible but clearly incorrect.

      CRITICAL: You MUST respond in strict JSON format. Use the following JSON schema:
      {
        "question": "The text of the question",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctIndex": <integer index from 0 to 3 matching the correct option>,
        "difficulty": "Easy" | "Medium" | "Hard",
        "explanationHint": "A small 1-2 sentence hint or takeaway fact to display after they answer"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are the ultimate educational quiz engine of 'Knowledge Horizon'. You only generate accurate, creative questions suited for the specified age groups and fields. You always output valid, clean JSON according to the specified structure.",
          temperature: 0.9,
        },
      });

      const text = response.text?.trim() || "";
      const parsedQuestion = JSON.parse(text);

      // Verify structure is complete
      if (
        parsedQuestion.question &&
        Array.isArray(parsedQuestion.options) &&
        parsedQuestion.options.length === 4 &&
        typeof parsedQuestion.correctIndex === "number"
      ) {
        return res.json({
          id: `ai-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          question: parsedQuestion.question,
          options: parsedQuestion.options,
          correctIndex: parsedQuestion.correctIndex,
          category: targetCategory,
          ageGroup: targetAge,
          difficulty: parsedQuestion.difficulty || "Medium",
          explanationHint: parsedQuestion.explanationHint || ""
        });
      }
    } catch (error) {
      console.warn("Gemini generation failed, falling back to rich static pool:", error);
    }
  }

  // Fallback Selector: finds premium question close to parameters and not excluded
  const filtered = FALLBACK_QUESTIONS.filter(
    (q) => q.ageGroup === targetAge && !excludes.includes(q.id)
  );

  let fallbackItem = filtered[Math.floor(Math.random() * filtered.length)];
  if (!fallbackItem) {
    // If we've exhausted options in this age group, try matching category, or grab any question excluding the seen ones
    const secondaryFiltered = FALLBACK_QUESTIONS.filter((q) => !excludes.includes(q.id));
    fallbackItem = secondaryFiltered.length > 0 
      ? secondaryFiltered[Math.floor(Math.random() * secondaryFiltered.length)]
      : FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
  }

  res.json({ ...fallbackItem });
});

// EXPLAIN WRONG CONTEXT ROUTE
app.post("/api/quiz/explain", async (req, res) => {
  const { question, options, correctIndex, selectedIndex, ageGroup } = req.body;
  const isCorrect = correctIndex === selectedIndex;
  
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `The student is playing 'Knowledge Horizon' (Age group: ${ageGroup || "general"}). 
      They were asked this question:
      "${question}"
      
      Here are the 4 options:
      ${options.map((opt: string, idx: number) => `${idx}) ${opt}`).join("\n")}
      
      The correct option is: "${options[correctIndex]}"
      The student chose: "${options[selectedIndex]}"
      
      This answer is ${isCorrect ? "CORRECT" : "INCORRECT"}.
      
      Write a friendly, highly educational explanation tailored towards this student. 
      Explain:
      1. Why the correct answer is scientifically/historically true.
      2. Briefly explain why the other options (and especially their selected incorrect choice: "${options[selectedIndex]}" if they were wrong) do not fit, debunking misconceptions in a positive, encouraging tone.
      3. Keep the language beautiful, clear, and scannable. Limit response to around 150-180 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the resident AI tutor at Knowledge Horizon, friendly, highly intellectual, and incredibly encouraging. You break down complex concepts into delightful, scannable nuggets for learners.",
          temperature: 0.7,
        }
      });

      return res.json({ explanation: response.text });
    } catch (error) {
      console.warn("Gemini explanation failed:", error);
    }
  }

  // High-quality hardcoded explanation fallback if API is not loaded
  const correctText = options[correctIndex];
  const selectedText = options[selectedIndex];

  let explanation = "";
  if (isCorrect) {
    explanation = `**Excellent work!** That is absolutely correct. "${correctText}" is the right answer. We hope you take a moment to celebrate! Each correct answer builds deep knowledge and sharpens your intellectual standing. Keep exploring to master the full arena!`;
  } else {
    explanation = `**A brilliant attempt!** While you selected "${selectedText}", the correct answer is **"${correctText}"**. 
    
    Here is why:
    Every choice represents a powerful avenue of study, but under closer examination, "${correctText}" fits the exact criteria requested. In learning, wrong turns are simply steps designed to unlock a deeper perspective. Feel free to review the library resources or retry the quiz parameters!`;
  }

  res.json({ explanation });
});

// VITE SERVER SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

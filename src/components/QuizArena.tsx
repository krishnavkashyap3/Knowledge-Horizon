import React, { useState, useEffect } from "react";
import { QuizQuestion, AgeGroup, UserProfile } from "../types";
import { Brain, HelpCircle, ArrowRight, CheckCircle2, XCircle, Sparkles, AlertCircle, RefreshCw, Sliders, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizArenaProps {
  user: UserProfile;
  initialCategory?: string;
  onAddXp: (amount: number) => void;
  onIncreaseDailyProgress: () => void;
}

export default function QuizArena({
  user,
  initialCategory = "Science",
  onAddXp,
  onIncreaseDailyProgress
}: QuizArenaProps) {
  // Domain selection
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  
  // Age configuration
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>(user.ageGroup);

  // Gamemode states
  const [continuousPractice, setContinuousPractice] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [sessionMax, setSessionMax] = useState<number>(10);

  // Active question state
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Question session seen filter
  const [sessionSeenIds, setSessionSeenIds] = useState<string[]>([]);

  // AI Tutoring explanation panel
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loadingAiExplanation, setLoadingAiExplanation] = useState<boolean>(false);

  // Load a brand new question from full stack Express API
  const fetchNewQuestion = async (category: string, age: AgeGroup, forceReset = false) => {
    setLoadingQuestion(true);
    setSelectedOptionIndex(null);
    setIsAnswerConfirmed(false);
    setAiExplanation("");

    const activeSeenList = forceReset ? [] : sessionSeenIds;
    if (forceReset) {
      setSessionSeenIds([]);
      setQuestionCount(1);
      setCorrectCount(0);
      setQuizFinished(false);
    }

    try {
      const response = await fetch("/api/quiz/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category,
          ageGroup: age,
          excludeList: activeSeenList
        })
      });

      if (!response.ok) {
        throw new Error("Failed to capture quiz data");
      }

      const data: QuizQuestion = await response.json();
      setCurrentQuestion(data);
      setSessionSeenIds((prev) => [...prev, data.id]);
    } catch (e) {
      console.error("AI Generation endpoint error:", e);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Run on initial mounting or parameter change
  useEffect(() => {
    fetchNewQuestion(selectedCategory, activeAgeGroup, true);
  }, [selectedCategory, activeAgeGroup]);

  // Handle choosing option index
  const handleSelectOptionIndex = (index: number) => {
    if (isAnswerConfirmed) return;
    setSelectedOptionIndex(index);
  };

  // Submit check answer
  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null || isAnswerConfirmed || !currentQuestion) return;
    
    setIsAnswerConfirmed(true);
    
    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      onAddXp(80); // +80 XP correct bonus
      onIncreaseDailyProgress(); // add toward progress bar units
    } else {
      // Reward +15 participation XP even on incorrect answers to encourage growth
      onAddXp(15);
      // Auto solicit Gemini explanation on wrong choice!
      handleQueryAiExplain();
    }
  };

  // Move forward to next turn
  const handleNextQuestion = () => {
    if (questionCount >= sessionMax && !continuousPractice) {
      // End session, reward 200 completion bonus XP
      onAddXp(200);
      setQuizFinished(true);
    } else {
      setQuestionCount((prev) => prev + 1);
      fetchNewQuestion(selectedCategory, activeAgeGroup, false);
    }
  };

  const handleRestartQuizAfterFinished = () => {
    setQuizFinished(false);
    fetchNewQuestion(selectedCategory, activeAgeGroup, true);
  };

  // Direct AI tutor connection proxy
  const handleQueryAiExplain = async () => {
    if (!currentQuestion || selectedOptionIndex === null) return;
    setLoadingAiExplanation(true);
    try {
      const response = await fetch("/api/quiz/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctIndex: currentQuestion.correctIndex,
          selectedIndex: selectedOptionIndex,
          ageGroup: activeAgeGroup
        })
      });

      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      console.error("Explanation fetching broken:", err);
      setAiExplanation("AI Tutor temporarily offline. Study hard!");
    } finally {
      setLoadingAiExplanation(false);
    }
  };

  const domains = ["Science", "Tech & AI", "History", "General Knowledge"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      id="quiz-arena-viewport"
    >
      {/* Intro banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-surface-container-high to-surface-container-low border border-white/5 overflow-hidden shadow-xl" id="quiz-banner">
        <div className="absolute right-0 top-0 w-80 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Brain className="w-4 h-4 text-primary" /> ACADEMIC LEVEL TESTING
            </div>
            <h1 className="text-xl md:text-2xl font-serif italic tracking-tight text-white font-normal" id="header-brand-title">Knowledge Horizon</h1>
            <h2 className="text-3xl md:text-4xl font-serif italic font-normal tracking-tight text-white mb-1">Quiz Arena</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl">
              Sharpen your knowledge standing with MCQ assessments designed for your age tier. Turn on continuous practice for endless study marathons!
            </p>
          </div>

          <div className="flex gap-4" id="quiz-stats-header">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-[#ffd700] uppercase block">PREVENT REPEATS</span>
              <p className="text-sm font-semibold text-white mt-1 font-mono">{sessionSeenIds.length} Served</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-[#4fdbc8] uppercase block">ACCURACY SCORE</span>
              <p className="text-sm font-semibold text-white mt-1 font-mono">
                {questionCount > 1 ? Math.round((correctCount / (questionCount - 1)) * 100) : 100}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Age Adapting Selectors & Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center bg-surface-container/30 border border-white/5 rounded-xl p-4 gap-4" id="arena-config-rail">
        <div className="flex items-center gap-3" id="age-tabs-bar">
          <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Target Tier:
          </span>
          <div className="flex bg-surface-container-high rounded-lg p-1 border border-white/5">
            {(["Child", "Teen", "Adult"] as AgeGroup[]).map((age) => (
              <button
                key={age}
                onClick={() => setActiveAgeGroup(age)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                  activeAgeGroup === age
                    ? "bg-primary text-black font-bold shadow-md"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {age === "Child" ? "Child (6-12)" : age === "Teen" ? "Teen (13-18)" : "Adult (19+)"}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Practice toggle (unlimited sessions) */}
        <div className="flex items-center md:justify-end gap-3" id="continuous-practice-block">
          <label className="text-xs text-on-surface-variant font-medium flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={continuousPractice}
              onChange={(e) => {
                setContinuousPractice(e.target.checked);
                setSessionMax(e.target.checked ? 9999 : 10);
              }}
              className="rounded bg-surface-container-high border-white/10 text-primary focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
            />
            Continuous Practice (Unlimited Questions)
          </label>

          <button
            onClick={() => fetchNewQuestion(selectedCategory, activeAgeGroup, true)}
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/90 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold transition-all ml-4"
            aria-label="Refresh question"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Pool
          </button>
        </div>
      </div>

      {/* Select active domain field selection */}
      <div className="flex gap-2 pb-2 h-11 border-b border-white/5 overflow-x-auto hide-scrollbar" id="quiz-category-scroll">
        {domains.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 font-semibold text-xs border rounded-lg shrink-0 cursor-pointer transition-all ${
              selectedCategory === cat
                ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                : "bg-surface-container/50 border-white/5 text-on-surface-variant hover:text-white hover:bg-surface-container"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Primary Quiz Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="arena-main-grid">
        {/* Core Question & MCQ options (occupies 2 cols) */}
        <div className="lg:col-span-2 space-y-4" id="main-assessment-area">
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 relative border-l-4 border-l-primary/60">
            {quizFinished ? (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-6" id="checkpoint-complete-screen">
                <div className="w-20 h-20 bg-primary/10 rounded-full border border-primary flex items-center justify-center text-primary relative shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif italic font-normal text-white">Course Checkpoint Reached!</h3>
                  <p className="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
                    Prerequisites fulfilled successfully. You completed {correctCount} out of {sessionMax} adaptive questions correct. Your knowledge standing is fully updated.
                  </p>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center gap-3 w-full max-w-sm">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Bonus Claimed: +200 XP Points
                  </span>
                </div>
                <button
                  onClick={handleRestartQuizAfterFinished}
                  className="bg-primary text-black hover:bg-white hover:text-black font-bold px-6 py-2.5 rounded-full transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.25)] cursor-pointer text-xs uppercase tracking-wider"
                >
                  Restart Quiz Session
                </button>
              </div>
            ) : loadingQuestion ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-on-surface-variant text-sm font-semibold">Tuning AI parameters for your tier...</p>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                {/* Visual progression metrics header */}
                <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>Category: {currentQuestion.category}</span>
                  <span>
                    {continuousPractice ? `Practice Unit #${questionCount}` : `Question ${questionCount} of ${sessionMax}`}
                  </span>
                </div>

                {/* Progress horizontal indicator */}
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${continuousPractice ? 100 : (questionCount / sessionMax) * 100}%`
                    }}
                  />
                </div>

                {/* Question title */}
                <h3 className="text-lg md:text-2xl font-serif italic font-normal tracking-tight text-white leading-snug">
                  {currentQuestion.question}
                </h3>

                {/* Vertical MCQs option list */}
                <div className="space-y-3 pt-2" id="options-timeline">
                  {currentQuestion.options.map((option, idx) => {
                    // Visual selectors styling logic
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    
                    let bgBorderClass = "bg-transparent border-white/10 text-white/90 hover:border-primary/50 hover:bg-white/5";
                    
                    if (isAnswerConfirmed) {
                      if (isCorrect) {
                        bgBorderClass = "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                      } else if (isSelected) {
                        bgBorderClass = "bg-rose-950/20 border-rose-500 text-rose-300";
                      } else {
                        bgBorderClass = "bg-transparent border-white/5 text-white/40 opacity-50";
                      }
                    } else if (isSelected) {
                      bgBorderClass = "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(245,158,11,0.15)]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOptionIndex(idx)}
                        disabled={isAnswerConfirmed}
                        className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-4 ${bgBorderClass} ${
                          !isAnswerConfirmed ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radial bullet */}
                          <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                            isAnswerConfirmed && isCorrect
                              ? "bg-emerald-500 border-emerald-500 text-[#121212]"
                              : isAnswerConfirmed && isSelected
                              ? "bg-rose-500 border-rose-500 text-[#121212]"
                              : isSelected
                              ? "bg-primary border-primary"
                              : "border-white/20"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <span>{option}</span>
                        </div>
                        
                        {isAnswerConfirmed && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerConfirmed && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom quiz workflow actions row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-white/5 gap-4" id="active-step-tray">
                  <div>
                    {/* Display immediate hint if answered incorrectly */}
                    {isAnswerConfirmed && (
                      <span className="text-secondary text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                        <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        Did you know: {currentQuestion.explanationHint || "Learning is the horizon!"}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 md:justify-end shrink-0" id="controls-group">
                    {/* Prompt AI explain manually anytime */}
                    {isAnswerConfirmed && (
                      <button
                        onClick={handleQueryAiExplain}
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        id="explain-gemini-btn"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Ask Gemini Explain
                      </button>
                    )}

                    {!isAnswerConfirmed ? (
                      <button
                        onClick={handleConfirmAnswer}
                        disabled={selectedOptionIndex === null}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                          selectedOptionIndex === null
                            ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                            : "bg-primary text-black hover:bg-white hover:text-black cursor-pointer shadow-md active:scale-95"
                        }`}
                        id="check-answer-btn"
                      >
                        Confirm Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="bg-primary text-black px-6 py-2.5 rounded-xl font-bold text-xs hover:shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        id="next-question-btn"
                      >
                        {questionCount >= sessionMax && !continuousPractice ? "Claim Completion" : "Next Question"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                <HelpCircle className="w-10 h-10 text-on-surface-variant opacity-40 mx-auto" />
                <h4 className="text-white font-bold">No active questions available</h4>
                <p className="text-on-surface-variant text-sm">Please trigger a reset or change age group configurations.</p>
              </div>
            )}
          </div>
        </div>

        {/* Gemini AI explanation panel drawer (occupies 1 col) */}
        <div className="col-span-1 flex flex-col h-full" id="ai-panel-wrapper">
          <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col h-full justify-between border-l-4 border-l-secondary relative overflow-hidden bg-surface-container-low/40">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs tracking-wider">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                RESIDENT AI TUTOR
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">Gemini Scholar Insights</h3>
              
              <div className="border-t border-white/5 pt-3" id="explanation-text-container">
                {loadingAiExplanation ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-on-surface-variant">Gemini formulating custom explanation...</p>
                  </div>
                ) : aiExplanation ? (
                  <div className="text-sm leading-relaxed text-white/90 space-y-3 font-sans select-text max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
                    {aiExplanation.split("\n\n").map((para, k) => (
                      <p key={k}>{para.replace(/\*\*/g, "")}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Choose and confirm your answer option. If you make an incorrect selection, **Gemini connects automatically** here to break down the concept on-the-fly and dispel misconceptions!
                  </p>
                )}
              </div>
            </div>

            {/* Extra status help notice */}
            <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/15 flex items-start gap-2.5 mt-4">
              <HelpCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span className="text-[10px] leading-relaxed text-secondary/90 font-medium">
                Gemini matches explanation levels to your Active Age Group settings for a comprehensive learning flow.
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import questions from "@/data/questions.json";
import { ANSWERS_KEY } from "@/lib/scoring/storageKeys";

type AnswerMap = Record<string, string>;

export default function QuizPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentQuestion.id];

  function handleSelect(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }

  function handleNext() {
    if (!selectedAnswer) return;

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
      router.push("/results");
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f2d1a 0%, #1a4a2e 40%, #0d3320 70%, #071a0f 100%)",
      }}
    >
      {/* Decorative botanical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #86efac, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #22c55e, transparent)" }}
        />
        {/* Leaf silhouettes */}
        <svg className="absolute top-10 right-10 opacity-10 w-32 h-32" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 C80 5, 95 30, 95 50 C95 70, 80 95, 50 95 C20 95, 5 70, 5 50 C5 30, 20 5, 50 5Z" fill="#4ade80" />
          <path d="M50 5 L50 95" stroke="#166534" strokeWidth="2" />
        </svg>
        <svg className="absolute bottom-20 left-10 opacity-10 w-24 h-24" viewBox="0 0 100 100" fill="none">
          <path d="M20 80 C20 80, 10 40, 50 10 C50 10, 90 40, 80 80" fill="#86efac" />
          <path d="M50 10 L50 80" stroke="#166534" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2">
            <span className="text-xl">🌿</span>
            <span className="text-white/90 font-semibold text-sm tracking-wide uppercase">Plant Finder</span>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* Progress Header */}
          <div
            className="px-8 pt-8 pb-6"
            style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "#dcfce7", color: "#166534" }}
              >
                {Math.round(progress)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #16a34a, #4ade80)",
                }}
              />
            </div>

            {/* Step dots */}
            <div className="flex justify-between mt-3">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i <= currentIndex ? "#16a34a" : "#bbf7d0",
                    transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question Image */}
          <div className="relative w-full h-52 overflow-hidden">
            <Image
              src={currentQuestion.image}
              alt={currentQuestion.question}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.95) 100%)",
              }}
            />
          </div>

          {/* Question Content */}
          <div className="px-8 pb-8">
            {/* Question Text */}
            <div className="text-center mb-8 -mt-4 relative z-10">
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-full text-2xl mb-3 shadow-lg"
                style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}
              >
                {currentQuestion.icon}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-left"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #f0fdf4, #dcfce7)"
                        : "#f9fafb",
                      border: isSelected ? "2px solid #16a34a" : "2px solid #f3f4f6",
                      boxShadow: isSelected
                        ? "0 4px 15px rgba(22,163,74,0.15)"
                        : "none",
                      transform: isSelected ? "translateX(4px)" : "none",
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: isSelected ? "#16a34a" : "#e5e7eb",
                      }}
                    >
                      {option.icon}
                    </span>

                    <span
                      className="flex-1 font-semibold text-sm"
                      style={{ color: isSelected ? "#14532d" : "#374151" }}
                    >
                      {option.label}
                    </span>

                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: isSelected ? "#16a34a" : "transparent",
                        borderColor: isSelected ? "#16a34a" : "#d1d5db",
                        color: "white",
                      }}
                    >
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              {currentIndex > 0 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors px-4 py-2 rounded-xl hover:bg-gray-100"
                >
                  <span>←</span> Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200"
                style={{
                  background: selectedAnswer
                    ? "linear-gradient(135deg, #15803d, #16a34a)"
                    : "#d1d5db",
                  boxShadow: selectedAnswer
                    ? "0 4px 15px rgba(22,163,74,0.4)"
                    : "none",
                  cursor: selectedAnswer ? "pointer" : "not-allowed",
                  transform: selectedAnswer ? "none" : "none",
                }}
              >
                {currentIndex === totalQuestions - 1 ? (
                  <>
                    <span>🌿</span>
                    <span>See My Plant Matches</span>
                  </>
                ) : (
                  <>
                    <span>Next Question</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-white/40 text-xs mt-6">
          {totalQuestions - currentIndex - 1 > 0
            ? `${totalQuestions - currentIndex - 1} question${totalQuestions - currentIndex - 1 > 1 ? "s" : ""} remaining`
            : "Last question — almost there!"}
        </p>
      </div>
    </main>
  );
}

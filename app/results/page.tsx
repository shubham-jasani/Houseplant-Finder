"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import rawPlants from "@/data/plants.json";
import rawQuestions from "@/data/questions.json";

import type { Plant, Question, Attribute } from "@/lib/scoring/types";
import { scorePlant } from "@/lib/scoring/scorePlant";
import { CARE_INFO } from "@/data/careInfo";
import { WHY_EXPLANATIONS } from "@/lib/scoring/explanations";
import { ANSWERS_KEY } from "@/lib/scoring/storageKeys";

const plants = rawPlants as Plant[];
const questions = rawQuestions as Question[];

type SortMode = "score" | "care" | "pet";

const careOrder: Record<string, number> = {
  "very-low": 0,
  low: 1,
  medium: 2,
  high: 3,
};

function getMatchInfo(score: number) {
  if (score <= 10) return { label: "Excellent Match", emoji: "🌟", bg: "#f0fdf4", text: "#166534", border: "#86efac" };
  if (score <= 14) return { label: "Great Match", emoji: "🌿", bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
  if (score <= 18) return { label: "Good Match", emoji: "🍃", bg: "#fefce8", text: "#854d0e", border: "#fde68a" };
  return { label: "Okay Match", emoji: "🌱", bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" };
}

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quiz/submit", { method: "POST" }).catch(() => {});
  }, []);

  const [petSafeOnly, setPetSafeOnly] = useState(false);
  const [lowLightOnly, setLowLightOnly] = useState(false);
  const [lowWaterOnly, setLowWaterOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("score");

  useEffect(() => {
    const stored =
      localStorage.getItem(ANSWERS_KEY) ||
      localStorage.getItem("plantQuizAnswers");

    if (stored) {
      setAnswers(JSON.parse(stored));
      localStorage.setItem(ANSWERS_KEY, stored);
    }
    setLoading(false);
  }, []);

  const handleRetakeQuiz = () => {
    localStorage.removeItem(ANSWERS_KEY);
    localStorage.removeItem("plantQuizAnswers");
  };

  const rankedPlants = useMemo(() => {
    if (!answers) return [];

    const scored = plants.map((plant) => scorePlant(plant, answers, questions));

    const filtered = scored.filter(({ plant }) => {
      const a = plant.attributes;
      if (petSafeOnly && a.petSafety !== "safe") return false;
      if (lowLightOnly && a.light !== "low") return false;
      if (lowWaterOnly && a.watering !== "low") return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "score") return a.score - b.score;
      if (sortMode === "care") {
        const ca = careOrder[a.plant.attributes.careTime] ?? 999;
        const cb = careOrder[b.plant.attributes.careTime] ?? 999;
        return ca !== cb ? ca - cb : a.score - b.score;
      }
      const pa = a.plant.attributes.petSafety === "safe" ? 0 : 1;
      const pb = b.plant.attributes.petSafety === "safe" ? 0 : 1;
      return pa !== pb ? pa - pb : a.score - b.score;
    });
  }, [answers, petSafeOnly, lowLightOnly, lowWaterOnly, sortMode]);

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f2d1a 0%, #1a4a2e 100%)" }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌿</div>
          <p className="text-white/70 font-medium">Finding your perfect plants…</p>
        </div>
      </main>
    );
  }

  if (!answers) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f2d1a 0%, #1a4a2e 100%)" }}
      >
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-gray-700 font-semibold text-lg mb-2">No quiz results found</p>
          <p className="text-gray-500 text-sm mb-6">Take the quiz to discover your perfect plant match</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
          >
            <span>🌿</span> Take the Quiz
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0f2d1a 0%, #1a4a2e 30%, #f0fdf4 30%)" }}
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden pt-12 pb-24 px-6">
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -left-10 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
        />
        <div
          className="absolute -top-5 -right-10 w-56 h-56 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #86efac, transparent)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <span className="text-lg">🌿</span>
            <span className="text-white/90 font-semibold text-xs tracking-widest uppercase">Plant Finder Results</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Your Perfect
            <span
              className="block"
              style={{
                background: "linear-gradient(90deg, #4ade80, #86efac)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Plant Matches 🌱
            </span>
          </h1>

          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
            Ranked by how closely each plant matches your space, lifestyle, and care preferences.
          </p>

          <Link
            href="/quiz"
            onClick={handleRetakeQuiz}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors border border-white/20 rounded-full px-5 py-2 hover:bg-white/10"
          >
            ↺ Retake the quiz
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 pb-16 space-y-5">
        {/* Filters Card */}
        <div
          className="rounded-2xl p-5 shadow-xl"
          style={{
            background: "white",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          }}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filter & Sort</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["🐾 Pet-safe", petSafeOnly, setPetSafeOnly],
                  ["🌑 Low light", lowLightOnly, setLowLightOnly],
                  ["💧 Low watering", lowWaterOnly, setLowWaterOnly],
                ] as const
              ).map(([label, value, setter]) => (
                <button
                  key={label}
                  onClick={() => setter(!value)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{
                    background: value
                      ? "linear-gradient(135deg, #15803d, #16a34a)"
                      : "#f3f4f6",
                    color: value ? "white" : "#374151",
                    boxShadow: value ? "0 3px 10px rgba(22,163,74,0.3)" : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">Sort:</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="text-xs font-semibold border-2 border-gray-100 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-emerald-400"
              >
                <option value="score">Best Match</option>
                <option value="care">Lowest Care</option>
                <option value="pet">Pet-safe First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 font-medium px-1">
          Showing <span className="font-bold text-emerald-700">{rankedPlants.length}</span> plant{rankedPlants.length !== 1 ? "s" : ""} matched to your profile
        </p>

        {/* Plant Cards */}
        {rankedPlants.map(({ plant, score }, index) => {
          const match = getMatchInfo(score);

          const lightCare = CARE_INFO.light[plant.attributes.light as keyof typeof CARE_INFO.light];
          const wateringCare = CARE_INFO.watering[plant.attributes.watering as keyof typeof CARE_INFO.watering];
          const careTimeCare = CARE_INFO.careTime[plant.attributes.careTime as keyof typeof CARE_INFO.careTime];

          const whyAttributes = (Object.keys(plant.attributes) as Attribute[]).filter((attr) => {
            const q = questions.find((qq) => qq.attribute === attr);
            return q && answers[q.id] === plant.attributes[attr];
          });

          const isBest = index === 0;

          return (
            <article
              key={plant.slug}
              className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "white",
                boxShadow: isBest
                  ? "0 8px 30px rgba(22,163,74,0.2), 0 0 0 2px #16a34a"
                  : "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              {/* Best match banner */}
              {isBest && (
                <div
                  className="px-6 py-2.5 flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
                >
                  <span className="text-sm">🌟</span>
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Best Overall Match For You
                  </span>
                </div>
              )}

              <div className="flex gap-0">
                {/* Plant Image */}
                <div className="relative flex-shrink-0 w-36 md:w-44">
                  <Image
                    src={`/images/plants/${plant.slug}.jpg`}
                    alt={plant.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 144px, 176px"
                  />
                  {/* Rank badge */}
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shadow-lg"
                    style={{
                      background: isBest ? "#16a34a" : "rgba(0,0,0,0.6)",
                      color: "white",
                    }}
                  >
                    #{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
                      {plant.name}
                    </h2>
                    <span
                      className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: match.bg,
                        color: match.text,
                        border: `1px solid ${match.border}`,
                      }}
                    >
                      {match.emoji} {match.label}
                    </span>
                  </div>

                  {/* Care attributes */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2.5 py-1 font-semibold">
                      ☀️ {lightCare}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1 font-semibold">
                      💧 {wateringCare}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-2.5 py-1 font-semibold">
                      🧤 {careTimeCare}
                    </span>
                    {plant.attributes.petSafety === "safe" && (
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-lg px-2.5 py-1 font-semibold">
                        🐾 Pet-safe
                      </span>
                    )}
                  </div>

                  {/* Why it matches */}
                  {whyAttributes.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {whyAttributes.slice(0, 2).map((attr) => (
                        <li key={attr} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>{WHY_EXPLANATIONS[attr]}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/plants/${plant.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    View care guide <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        {rankedPlants.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-700 font-semibold text-lg mb-2">No plants match your filters</p>
            <p className="text-gray-500 text-sm">Try removing some filters to see more results</p>
          </div>
        )}

        {/* Retake CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #0f2d1a, #1a4a2e)" }}
        >
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="text-white font-bold text-lg mb-2">Want different results?</h3>
          <p className="text-white/60 text-sm mb-5">Retake the quiz with updated preferences</p>
          <Link
            href="/quiz"
            onClick={handleRetakeQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #15803d, #16a34a)",
              boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
            }}
          >
            <span>🌿</span> Retake the Quiz
          </Link>
        </div>
      </div>
    </main>
  );
}

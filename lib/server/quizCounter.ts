import { kv } from "@vercel/kv";

const QUIZ_COUNTER_KEY = "quiz:submissions";

/**
 * Increment when a user finishes the quiz
 */
export async function incrementQuizSubmissionCount() {
  await kv?.incr(QUIZ_COUNTER_KEY);
}

/**
 * Read total quiz submissions (admin-only)
 */
export async function getQuizSubmissionCount() {
  const count = (await kv?.get)<number>(QUIZ_COUNTER_KEY);
  return count ?? 0;
}

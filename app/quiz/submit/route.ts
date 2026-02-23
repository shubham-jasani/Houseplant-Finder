import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { incrementQuizSubmissionCount } from "@/lib/server/quizCounter";

export async function POST() {
    const cookieStore = await cookies();
    const hasCounted = cookieStore?.get("quiz_submitted");

  if (!hasCounted) {
    await incrementQuizSubmissionCount();
    cookieStore?.set("quiz_submitted", "true", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return NextResponse?.json({ ok: true });
}

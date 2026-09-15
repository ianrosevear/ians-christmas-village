import { NextRequest, NextResponse } from "next/server";

const CORRECT_ANSWER = "934805";
const CLUE_URL = "https://www.youtube.com/@ericnysac";

export async function POST(req: NextRequest) {
  const { answer } = await req.json();
  const correct =
    typeof answer === "string" && answer.trim() === CORRECT_ANSWER;
  return NextResponse.json(correct ? { correct, clueUrl: CLUE_URL } : { correct });
}

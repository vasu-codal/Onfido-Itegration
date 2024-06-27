"use server";

import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch("https://api.us.onfido.com/v3.6/applicants", {
    method: "POST",
    headers: {
      Authorization: `Token token=${process.env.NEXT_PUBLIC_ONFIDO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(
    {
      error: false,
      message: "User details.",
      data: data,
    },
    { status: 200 }
  );
}

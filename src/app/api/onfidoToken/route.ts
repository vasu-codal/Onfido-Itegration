"use server";

import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch("https://api.us.onfido.com/v3.6/sdk_token", {
    method: "POST",
    headers: {
      Authorization: `Token token=${process.env.NEXT_PUBLIC_ONFIDO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicant_id: body.applicantId,
    }),
  });
  const data = await response.json();
  return NextResponse.json(
    {
      error: false,
      message: "API token.",
      data: data,
    },
    { status: 200 }
  );
}

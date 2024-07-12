"use server";

import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch("https://api.eu.onfido.com/v3.6/extractions", {
    method: "POST",
    headers: {
      Authorization: `Token token=${process.env.NEXT_PUBLIC_ONFIDO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: body.document_id,
    }),
  });
  const data = await response.json();
  return NextResponse.json(
    {
      error: false,
      data: data,
    },
    { status: 200 }
  );
}
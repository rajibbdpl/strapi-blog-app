import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookie set" });

  response.cookies.set("token", token, {
    httpOnly: false,
    secure: false,
    path: "/",
    sameSite:"lax",
    maxAge: 60 * 60 * 24 * 2, // 2days
  });

  return response;
}

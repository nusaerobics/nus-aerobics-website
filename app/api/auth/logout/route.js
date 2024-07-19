import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const response = await NextResponse.json({ message: "Successful logout", success: true });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Unsuccessful logout: ${error.message}` },
      { status: 500 }
    );
  }
}

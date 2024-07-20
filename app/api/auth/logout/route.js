import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const response = await NextResponse.json({
      message: "Successful logout",
      success: true,
    });
    cookies().set("session", "", { expires: new Date(0) });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Unsuccessful logout: ${error.message}` },
      { status: 500 }
    );
  }
}

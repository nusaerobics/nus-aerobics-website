// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  // let redirectPath;
  try {
    const response = NextResponse.json({
      message: "Successful logout",
      success: true,
    });
    cookies().set("session", "", { expires: new Date(0) });
    // redirectPath = "/";
    return response;
  } catch (error) {
    console.log(error);
    // redirectPath="/dashboard";
    return NextResponse.json(
      { error: `Unsuccessful logout: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // if (redirectPath) {
    //   redirect(redirectPath);
    // }
  }
}

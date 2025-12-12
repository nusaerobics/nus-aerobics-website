// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export async function POST(request) {
  // let redirectPath;
  try {
    const response = NextResponse.json({
      message: "Successful logout",
      success: true,
    });
    const cookieStore = await cookies();
    cookieStore.set("session", "", { expires: new Date(0) });
    // redirectPath = "/";
    return response;
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
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

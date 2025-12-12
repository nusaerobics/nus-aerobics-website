import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "../../../lib";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

const bcrypt = require("bcrypt");

const db = require("../../../config/sequelize");
const User = db.users;

// Followed this tutorial: https://medium.com/@fazalwahab1/how-to-implement-jwt-authentication-in-next-js-14-bb280c2703fe
// https://stackoverflow.com/questions/74946913/typescript-issue-with-sequelize-that-i-cant-solve

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      return NextResponse.json(
        { error: `User does not exist.` },
        { status: 400 }
      );
    }
    // NOTE: Adding trim() to when new accounts are created
    const isMatchingPassword = await bcrypt.compare(password, user.password);
    if (!isMatchingPassword) {
      return NextResponse.json(
        { error: "Email and password does not match" },
        { status: 400 }
      );
    }
    const expires = new Date(Date.now() + (24 * 60 * 60 * 1000));
    const session = await encrypt({ user: user.toJSON(), expires: expires });
    const cookieStore = await cookies();
    cookieStore.set("session", session, { expires, httpOnly: true });

    const response = NextResponse.json({
      message: "Successful login",
      success: true,
    });
    return response;
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

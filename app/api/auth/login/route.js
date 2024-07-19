import User from "../../../models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");

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
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const isMatchingPassword = await bcrypt.compare(password, user.password);
    if (!isMatchingPassword) {
      return NextResponse.json(
        { error: "Email and password does not match" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user.id,
      name: user.name,
      email: user.email,
      permission: user.permission,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      message: "Successful login",
      success: true,
    });
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

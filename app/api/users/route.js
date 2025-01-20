import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");

const db = require("../../config/sequelize");
const User = db.users;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getUserByEmail
    if (searchParams.get("email") != undefined) {
      const email = searchParams.get("email");
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        throw new Error("User does not exist");
      }
      return NextResponse.json(user, { status: 200 });
    }

    // getNumberOfUsers
    if (searchParams.get("isCountUsers") != undefined) {
      const number = await User.count();
      if (number == null) {
        return NextResponse.json(0, { status: 200 });
      }
      return NextResponse.json(number, { status: 200 });
    }

    // getNumberOfCreditsUnused
    if (searchParams.get("isCountCredits") != undefined) {
      const number = await User.sum("balance");
      if (number == null) {
        return NextResponse.json(0, { status: 200 });
      }
      return NextResponse.json(number, { status: 200 });
    }

    // getUsers
    const users = await User.findAll();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting user(s): ${ error }` },
      { status: 500 }
    );
  }
}

// createUser
export async function POST(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const user = await User.findOne({ where: { email: email }, transaction: t });
    if (user) {
      return NextResponse.json({ error: `A user already exists for ${ email }. Try again with a unique email.` }, { status: 400 });
    }

    const passwordStripped = password.trim();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordStripped, saltRounds);

    const data = await User.create({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    }, { transaction: t });
    await t.commit();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { message: `Error creating user: ${ error }` },
      { status: 500 }
    );
  }
}

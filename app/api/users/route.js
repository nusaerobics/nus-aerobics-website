import User from "../../models/user.model";
import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");

// NOTE: Change to this?
// Given a request to /home, pathname is /home
// request.nextUrl.pathname
// Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
// request.nextUrl.searchParams

// Reference about NextResponse vs. Response: https://stackoverflow.com/questions/77332669/use-nextresponse-response-or-nextapiresponse-in-returning-get-and-data-in-next
// NextRequest < Request and is used in middleware

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    
    // getUserById
    if (searchParams.get("id") != undefined) {
      const id = searchParams.get("id");
      const user = await User.findOne({ where: { id: id } });
      if (!user) {
        throw new Error(`User ${id} does not exist`);
      }
      return NextResponse.json(user, { status: 200 });
    }
    // getUsers
    const users = await User.findAll();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting user(s): ${error}` },
      { status: 500 }
    );
  }
}

// createUser
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const { name, email, password } = body;

    const isExistingEmail = await User.findOne({ where: { email: email } });
    if (isExistingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400});
      // throw new Error("Email already registered");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating user: ${error}` },
      { status: 500 }
    );
  }
}

// updateUser
export async function PUT(request) {
  try {
    const body = await request.json();
    let updates; // updates = only fields which were changed
    const id = body.id;

    /** Updates come from:
     * 1) User book/unbook class (balance)
     * 2) User edits profile (name, password, NTH: whether gets email notifications)
     * 3) Admin changes user's permission settings (permission)
     * 4) Admin unbooks user (balance)
     */
    if (body.balance != undefined) {
      const balance = body.balance;
      updates = { balance: balance };
    }
    if (body.name != undefined) {
      const name = body.name;
      updates = { name: name };
    }
    if (body.password != undefined) {
      const password = body.password;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updates = { password: hashedPassword };
    }
    if (body.permission != undefined) {
      // TODO: Add check to verify it's either "admin" or "normal"
      const permission = body.permission;
      updates = { permission: permission };
    }

    const data = await User.update(updates, { where: { id: id } });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error updating user: ${error}` },
      { status: 500 }
    );
  }
}

// deleteUser
export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = body.id;
    await User.destroy({ where: { id: id }});
    return NextResponse.json({ json: `User ${id} deleted successfully`}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error deleting user: ${error}` },
      { status: 500 }
    );
  }
}

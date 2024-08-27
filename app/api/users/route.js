import { NextResponse } from "next/server";

const db = require("../../config/sequelize");
const User = db.users;
const bcrypt = require("bcrypt");

export async function GET(request) {
  try {
    await db.sequelize.authenticate();

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
      { message: `Error getting user(s): ${error}` },
      { status: 500 }
    );
  }
}

// createUser
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // const isExistingEmail = await User.findOne({ where: { email: email } });
    // if (isExistingEmail) {
    //   return NextResponse.json(
    //     { error: "Email already registered" },
    //     { status: 400 }
    //   );
    // }

    const passwordStripped = password.trim();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordStripped, saltRounds);

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

    const user = await User.findOne({ where: { id: id } });
    /** Updates come from:
     * 1) User book/unbook class (balance)
     * 2) User edits profile (name AND email OR password, NTH: whether gets email notifications)
     * 3) Admin changes user's permission settings (permission)
     * 4) Admin unbooks user (balance)
     */
    if (body.balance != undefined) {
      const balance = body.balance;
      updates = { balance: balance };
    }
    if (body.name != undefined && body.email != undefined) {
      const name = body.name;
      const email = body.email;
      updates = { name: name, email: email };
    }
    if (body.newPassword != undefined) {
      const newPassword = body.newPassword;

      if (body.currentPassword != undefined) {
        // If changing password in Profile
        const currentPassword = body.currentPassword;
        const existingPassword = user.password;

        const isMatchingPassword = await bcrypt.compare(
          currentPassword,
          existingPassword
        );
        if (!isMatchingPassword) {
          return NextResponse.json(
            { error: "Current password does not match existing" },
            { status: 400 }
          );
        }
      }

      // Else for resetting to temporary password

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      updates = { password: hashedPassword };
    }

    // TODO: Should have to handle permission and balance at the same time from admin
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
    await User.destroy({ where: { id: id } });
    return NextResponse.json(
      { json: `User ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error deleting user: ${error}` },
      { status: 500 }
    );
  }
}

// NOTE: Change to this?
// Given a request to /home, pathname is /home
// request.nextUrl.pathname
// Given a request to /home?name=lee, searchParams is { 'name': 'lee' }
// request.nextUrl.searchParams

// Reference about NextResponse vs. Response: https://stackoverflow.com/questions/77332669/use-nextresponse-response-or-nextapiresponse-in-returning-get-and-data-in-next
// NextRequest < Request and is used in middleware

import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");

const db = require("../../config/sequelize");
const Booking = db.bookings;
const Class = db.classes;
const User = db.users;
const Transaction = db.transactions;

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
        throw new Error(`User ${ id } does not exist`);
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

// updateUser
export async function PUT(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    let updates;
    const id = body.id;
    const user = await User.findOne({ where: { id: id }, transaction: t });

    // Admin credits individual account from Users page
    if (body.balance != undefined) {
      const balance = body.balance;
      updates = { balance: balance };
    }

    // User edits name and/or email on Profile page
    if (body.name != undefined && body.email != undefined) {
      const name = body.name;
      const email = body.email;
      updates = { name: name, email: email };
    }

    // User edits password on Profile page
    if (body.newPassword != undefined && body.currentPassword != undefined) {
      const newPassword = body.newPassword;
      const currentPassword = body.currentPassword;
      const dbPassword = user.password;

      const isMatchingPassword = await bcrypt.compare(
        currentPassword,
        dbPassword
      );
      if (!isMatchingPassword) {
        return NextResponse.json(
          { error: "Current password does not match existing password." },
          { status: 400 }
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      updates = { password: hashedPassword };
    }

    const data = await User.update(updates, { where: { id: id }, transaction: t });
    await t.commit();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { message: `Error updating user: ${ error }` },
      { status: 500 }
    );
  }
}

// deleteUser
export async function DELETE(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const id = body.id;

    // 1. Delete user's transactions.
    await Transaction.destroy({ where: { userId: id }, transaction: t });

    // 2. Delete user's bookings.
    const bookings = await Booking.findAll({ where: { userid: id }, transaction: t });
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const classId = booking.classId;

      // 2a. Update booked class' capacity.
      const bookedClass = await Class.findOne({ where: { id: classId }, transaction: t });
      await Class.update({ bookedCapacity: bookedClass.bookedCapacity - 1 }, {
        where: { id: classId },
        transaction: t
      });
    }
    await Booking.destroy({ where: { userId: id }, transaction: t });

    // 3. Delete user.
    await User.destroy({ where: { id: id }, transaction: t });
    await t.commit();
    return NextResponse.json(`User ${ id } deleted successfully`,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { error: `Unable to delete user: ${ error }` },
      { status: 500 }
    );
  }
}

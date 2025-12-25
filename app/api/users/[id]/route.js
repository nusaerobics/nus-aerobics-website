import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");

import db from "../../../config/sequelize";
const Booking = db.bookings;
const Class = db.classes;
const Transaction = db.transactions;
const User = db.users;
const Waitlist = db.waitlists;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await User.findOne({ where: { id: id }});
    if (user == null) {
      return NextResponse.json(
        { error: `User ${id} does not exist` },
        { status: 400 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Unable to get user: ${ error.message }` });
  }
}

// updateUser
export async function PUT(request, { params }) {
  const t = await db.sequelize.transaction();
  try {
    const { id } = await params;
    const body = await request.json();
    let updates;
    const user = await User.findOne({ where: { id: id }, transaction: t });

    // Admin credits individual account from Users page
    if (body.amount != undefined) {
      const amount = body.amount;
      updates = { balance: parseInt(user.balance) + parseInt(amount) };
      await Transaction.create({
        userId: id,
        amount: amount,
        type: "deposit",
        description: `Deposited ${ amount } credit(s)`,
      }, { transaction: t });
    }

    // User edits name and/or email on Profile page
    if (body.name != undefined && body.email != undefined) {
      const name = body.name;
      const email = body.email;
      if (email !== user.email) {
        const existingUser = await User.findOne({ where: { email: email }, transaction: t });
        if (existingUser) {
          return NextResponse.json(
            { error: `Email ${ email } is already registered. Please use a different email.` },
            { status: 400 }
          );
        }
      }
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

      const passwordStripped = newPassword.trim();
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(passwordStripped, saltRounds);
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
export async function DELETE(request, { params }) {
  const t = await db.sequelize.transaction();
  try {
    const id = await params.id;

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

    // 3. Delete user's waitlists.
    await Waitlist.destroy({ where: { userId: id }, transaction: t });

    // 4. Delete user.
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

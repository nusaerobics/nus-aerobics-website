import { NextResponse } from "next/server";

import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const db = require("../../config/sequelize");
const { Op } = require("sequelize");
const Booking = db.bookings;
const Class = db.classes;
const User = db.users;

export async function GET(request) {
  const t = await db.sequelize.transaction();
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const classes = await Class.findAll({ transaction: t });

    // getTodayClasses /api/classes?isToday=true
    if (searchParams.get("isToday") != undefined) {
      const todayClasses = classes.filter((c) => {
        const classDate = toZonedTime(c.date, "Asia/Singapore");
        const currentDate = toZonedTime(new Date(), "Asia/Singapore");
        return isSameDay(classDate, currentDate);
      });

      await t.commit();
      return NextResponse.json(todayClasses, { status: 200 });
    }

    // getClassesByUser /api/classes?userId=
    if (searchParams.get("userId") != undefined) {
      const userId = searchParams.get("userId");

      const bookedClassIds = await Booking.findAll({
        where: { userId: userId },
        attributes: ['classId'],
        transaction: t,
      }).then((bookings) => bookings.map((booking) => booking.classId));
      const filteredClasses = await Class.findAll(
        {
          where: {
            id: { [Op.notIn]: bookedClassIds },
            date: { [Op.gt]: new Date() },  // status: { [Op.ne]: "closed" }
          },
          transaction: t
        });
      await t.commit();
      return NextResponse.json(filteredClasses, { status: 200 });
    }

    // getClasses
    await t.commit();
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ message: `Error getting class(es): ${ error }` }, { status: 500 });
  }
}

// createClass
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const { name, description, date, status } = body;
    const data = await Class.create({
      name: name, description: description, date: date, status: status,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Error creating class: ${ error }` }, { status: 500 });
  }
}

// TODO: Move PUT and DELETE to [id]/route.js
// updateClass
export async function PUT(request) {
  // All values have to be inputted in request - either the unchanged values or updated values
  try {
    const body = await request.json();
    const { id, name, description, date, maxCapacity, bookedCapacity, status } = body;
    const data = await Class.update({
      name: name,
      description: description,
      date: date,
      maxCapacity: maxCapacity,
      bookedCapacity: bookedCapacity,
      status: status,
    }, { where: { id: id } });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: `Error updating class: ${ error }` }, { status: 500 });
  }
}

// deleteClass
export async function DELETE(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const id = body.id;

    // 1. Get bookings of a class.
    const bookings = await Booking.findAll({ where: { classId: id }, transaction: t });
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const userId = booking.userId;

      const user = await User.findOne({ where: { id: userId }, transaction: t });
      // 1a. Refund each user.
      await User.update({ balance: user.balance + 1 }, { where: { id: userId }, transaction: t });

      // 1b. Delete each booking.
      await Booking.destroy({ where: { id: booking.id }, transaction: t });
    }

    // 2. Delete class.
    await Class.destroy({ where: { id: id }, transaction: t });

    await t.commit();
    return NextResponse.json({ json: `Class ${ id } deleted successfully` }, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ message: `Error deleting class: ${ error }` }, { status: 500 });
  }
}

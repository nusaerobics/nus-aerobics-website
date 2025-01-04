import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
import { now } from "sequelize/lib/utils";

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

    // getClassById
    if (searchParams.get("id") != undefined) {
      const id = searchParams.get("id");
      const targetClass = await Class.findOne({ where: { id: id } });
      if (!targetClass) {
        throw new Error(`Class ${ id } does not exist`);
      }
      return NextResponse.json(targetClass, { status: 200 });
    }

    const classes = await Class.findAll({ transaction: t });

    // getTodayClasses /api/classes?isToday=true
    if (searchParams.get("isToday") != undefined) {
      const todayClasses = classes.filter((c) => {
        const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
        const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
        const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");

        const sgClassYear = sgClassDate.getFullYear();
        const sgClassMonth = sgClassDate.getMonth();
        const sgClassDay = sgClassDate.getDate();

        const sgCurrentYear = sgCurrentDate.getFullYear();
        const sgCurrentMonth = sgCurrentDate.getMonth();
        const sgCurrentDay = sgCurrentDate.getDate();

        return (sgClassYear == sgCurrentYear && sgClassMonth == sgCurrentMonth && sgClassDay == sgCurrentDay);
      });
      return NextResponse.json(todayClasses, { status: 200 });
    }

    // getClassesByUser /api/classes?userId=
    if (searchParams.get("userId") != undefined) {
      const userId = searchParams.get("userId");
      // await Class.update({ status: "open" }, { where: { bookedCapacity: { [Op.lt]: 19 }}, transaction: t });
      // await Class.update({ status: "full" }, { where: { bookedCapacity: { [Op.gte]: 19 }}, transaction: t });
      // const pastClasses = classes.filter((c) => {
      //   const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
      //   const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
      //   const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
      //   return sgClassDate < sgCurrentDate;
      // })
      // for (let i = 0; i < pastClasses.length; i++) {
      //   const c = pastClasses[i];
      //   await Class.update({ status: "closed" }, { where: { id: c.id }, transaction: t });
      // }

      const bookedClassIds = await Booking.findAll({
        where: { userId: userId },
        attributes: ['classId'],
        transaction: t,
      }).then((bookings) => bookings.map((booking) => booking.classId));
      const filteredClasses = await Class.findAll({ where: { id: { [Op.notIn]: bookedClassIds } }, transaction: t });
      const upcomingClasses = filteredClasses.filter((c) => {
        const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
        const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
        const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
        return sgClassDate > sgCurrentDate;
      })
      await t.commit();
      return NextResponse.json(upcomingClasses, { status: 200 });
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

    // 1. get bookings of a class
    const bookings = await Booking.findAll({ where: { classId: id }, transaction: t });
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const userId = booking.userId;

      const user = await User.findOne({ where: { id: userId }, transaction: t });
      // 1a. refund each user
      await User.update({ balance: user.balance + 1 }, { where: { id: userId }, transaction: t });

      // 1b. delete each booking
      await Booking.destroy({ where: { id: booking.id }, transaction: t });
    }

    // 2. delete class
    await Class.destroy({ where: { id: id }, transaction: t });

    await t.commit();
    return NextResponse.json({ json: `Class ${ id } deleted successfully` }, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ message: `Error deleting class: ${ error }` }, { status: 500 });
  }
}

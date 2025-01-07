import { NextResponse } from "next/server";

const db = require("../../config/sequelize");
const Class = db.classes;
const Booking = db.bookings;
const Transaction = db.transactions;
const User = db.users;
const Waitlist = db.waitlists;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getBookingsByUser
    if (searchParams.get("userId") != undefined) {
      const userId = searchParams.get("userId");
      const userBookings = await Booking.findAll({
        where: { userId: userId },
        order: [[{ model: Class, as: "class" }, "date", "ASC"]],
        include: [
          {
            model: Class,
            required: true,
            as: "class",
          },
        ],
      });
      return NextResponse.json(userBookings, { status: 200 });
    }

    // getBookingsByClass
    if (searchParams.get("classId") != undefined) {
      const classId = searchParams.get("classId");
      const classBookings = await Booking.findAll({
        where: { classId: classId },
        include: [
          {
            model: User,
            required: true,
            as: "user",
          },
        ],
      });
      return NextResponse.json(classBookings, { status: 200 });
    }

    // getNumberOfBookings
    if (searchParams.get("isCount") != undefined) {
      const number = await Booking.count();
      if (number == null) {
        return NextResponse.json(0, { status: 200 });
      }
      return NextResponse.json(number, { status: 200 });
    }

    // getNumberOfBookingsByUser
    if (searchParams.get("isCountByUser") != undefined) {
      const userId = searchParams.get("isCountByUser");
      const number = await Booking.count({
        where: { userId: userId },
      });
      if (number == null) {
        return NextResponse.json(0, { status: 200 });
      }
      return NextResponse.json(number, { status: 200 });
    }

    // getBookings
    const bookings = await Booking.findAll();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting booking(s): ${ error }` },
      { status: 500 }
    );
  }
}

// createBooking
export async function POST(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { classId, userId, isForced } = body;  // NOTE: isForced = TRUE when admin makes the booking, else FALSE

    // 1. Find user and class.
    const selectedClass = await Class.findOne({ where: { id: classId } }, { t });
    const user = await User.findOne(
      { where: { id: userId } },
      { t },
    );

    // 2a. Check user's balance.
    if (user.balance < 1) {
      throw new Error("Your account has insufficient credits. Please purchase more credits first.");
    }

    // 2b. Check class capacity.
    if (!isForced) {
      if (selectedClass.bookedCapacity >= selectedClass.maxCapacity) {
        throw new Error(`${ selectedClass.name } is fully booked. Please join the waitlist or book another class.`);
      }
    }

    // 3. Create booking for user.
    const newBooking = await Booking.create(
      {
        userId: userId,
        classId: classId,
      },
      { transaction: t },
    );

    // 3. Update user's balance.
    await User.update(
      { balance: user.balance - 1 },
      {
        where: { id: userId },
        transaction: t,
      });

    // 4. Update class' booked capacity.
    await Class.update(
      { bookedCapacity: selectedClass.bookedCapacity + 1 },
      { where: { id: classId }, transaction: t });

    // 5. Create new transaction.
    await Transaction.create({
      userId: user.id,
      amount: -1,
      type: "book",
      description: `Booked '${ selectedClass.name }'`,
    }, { transaction: t });

    // 6. Delete any waitlist user had for class.
    const waitlist = await Waitlist.findOne({ where: { userId: userId, classId: classId }, transaction: t });
    if (waitlist !== null) {
      await Waitlist.destroy({ where: { id: waitlist.id }, transaction: t });
    }

    await t.commit();
    return NextResponse.json(newBooking, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { message: `${ error.message }` },
      { status: 500 }
    );
  }
}

// updateBooking
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, attendance } = body;
    const data = await Booking.update(
      { attendance: attendance },
      { where: { id: id } }
    );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error updating booking: ${ error }` },
      { status: 500 }
    );
  }
}

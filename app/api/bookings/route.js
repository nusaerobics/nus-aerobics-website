import { NextResponse } from "next/server";

const db = require("../../config/sequelize");

const Class = db.classes;
const Booking = db.bookings;
const Transaction = db.transactions;
const User = db.users;
const Waitlist = db.waitlists;

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendEmail(user, selectedClass) {
  const emailHTML = `
        Hi ${ user.name },
        <br>
        <br>Thank you for booking a class with us! Here are the details of your booking and how to prepare for class:
        <br>
        <br>
          <table>
            <tr>
              <td><strong>Class</strong></td>
              <td>${ selectedClass.name }</td>
            </tr>
            <tr>
              <td><strong>Date and Time</strong></td>
              <td>Please check our schedule/website</td>
            </tr>
            <tr>
              <td><strong>Location</strong></td>
              <td>UTown Gym Aerobics Studio</td>
            </tr>
          </table>
        <br><strong>Attire</strong>
        <br>Come to class dressed in comfortable attire. If you booked HIIT, Kickboxing, KKardio, or Zumba, we recommend you to wear training shoes. 
        <br>
        <br><strong>What to Bring</strong>
        <br>All equipment for your class will be provided. Just bring yourself and a water bottle!
        <br>
        <br><strong>Cancellation Policy</strong>
        <br>If you no longer can attend, please remember to cancel your booking under the Reservations page. To receive a refund for a class credit, please cancel at least 12 hours before the class. Cancellations made less than 12 hours before the class will result in a full charge of the class credit.
        <br>
        <br>Please remember to arrive early in order for us to take attendance. If you have any questions or problems, please feel free to contact us at <a href="mailto:aerobics@nussportsclub.org">aerobics@nussportsclub.org</a>.
        <br>
        <br>We're looking forward to seeing you in class!
        <br>Kindest regards,
        <br>NUS Aerobics`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "[NUS Aerobics] Get ready for your class!",
    html: emailHTML,
  };
  return transporter.sendMail(mailOptions);
}

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

    // 1. Find user.
    const user = await User.findOne(
      { where: { id: userId }, transaction: t },
    );

    // 1a. Check user's balance.
    if (user.balance < 1) {
      throw new Error("Your account has insufficient credits. Please purchase more credits first.");
    }

    // 2. Find class.
    const selectedClass = await Class.findOne({ where: { id: classId }, transaction: t });

    // 2a. Check class capacity.
    if (!isForced) {
      if (selectedClass.bookedCapacity >= selectedClass.maxCapacity) {
        throw new Error(`${ selectedClass.name } is fully booked. Please join the waitlist or book another class.`);
      }
    }

    // 3. Update class' booked capacity.
    await Class.update(
      { bookedCapacity: selectedClass.bookedCapacity + 1 },
      { where: { id: classId }, transaction: t });


    // 4. Create booking for user.
    const newBooking = await Booking.create(
      {
        userId: userId,
        classId: classId,
      },
      { transaction: t },
    );

    // 5. Update user's balance.
    await User.update(
      { balance: user.balance - 1 },
      {
        where: { id: userId },
        transaction: t,
      });

    // 6. Create new transaction.
    await Transaction.create({
      userId: user.id,
      amount: -1,
      type: "book",
      description: `Booked '${ selectedClass.name }'`,
    }, { transaction: t });

    // 7. Delete any waitlist user had for class.
    const waitlist = await Waitlist.findOne({ where: { userId: userId, classId: classId }, transaction: t });
    if (waitlist !== null) {
      await Waitlist.destroy({ where: { id: waitlist.id }, transaction: t });
    }

    await t.commit();
    await t.afterCommit(async () => {
      if (!isForced) {
        await sendEmail(user, selectedClass);
      }
    });

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

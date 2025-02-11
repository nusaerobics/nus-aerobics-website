import { NextResponse } from "next/server";

import db from "../../../config/sequelize";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const Booking = db.bookings;
const Class = db.classes;
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

// getBooking
export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const booking = await Booking.findOne({ where: { id: id } });
    if (booking == null) {
      throw new Error(`Booking ${ id } does not exist.`);
    }
    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Unable to get booking: ${ error.message }` });
  }
}

// deleteBooking
export async function DELETE(request, { params }) {
  const t = await db.sequelize.transaction();
  try {
    const id = await params.id;
    const body = await request.json();
    const { classId, userId, isForced } = body;  // NOTE: isForced = TRUE when admin cancels the booking, else FALSE

    const bookedClass = await Class.findOne(
      {
        where: { id: classId },
        transaction: t
      }
    );
    const user = await User.findOne({ where: { id: userId }, transaction: t });

    const classDate = toZonedTime(bookedClass.date, "Asia/Singapore");
    const currentDate = toZonedTime(new Date(), "Asia/Singapore");

    // 1. Delete booking.
    if (!isForced) {  // Only apply isUpcoming check on cancellations made from users.
      const isUpcoming = classDate > currentDate;
      if (!isUpcoming) {
        throw new Error("Only upcoming class bookings can be cancelled");
        // return NextResponse.json(
        //   { error: `Only upcoming class bookings can be cancelled.` },
        //   { status: 400 }
        // );
      }
    }

    const booking = await Booking.findOne({ where: { id: id }, transaction: t });
    if (booking == null) {  // Check if the booking exists to prevent multiple refunds.
      throw new Error(`Booking ${ id } does not exist`);
    }
    await Booking.destroy(
      {
        where: { id: id },
        transaction: t
      }
    );

    // 2. Update class' booked capacity.
    await Class.update(
      {
        bookedCapacity: bookedClass.bookedCapacity - 1
      },
      { where: { id: classId }, transaction: t });

    // 3. Update user's balance, only if cancelling before 12 hours.
    const cancelDeadline = toZonedTime(new Date(bookedClass.date.getTime() - 12 * 60 * 60 * 1000), "Asia/Singapore");
    const isAllowedCancel = currentDate < cancelDeadline;

    if (isAllowedCancel) {
      await User.update(
        { balance: user.balance + 1 },
        { where: { id: userId }, transaction: t }
      );

      // 4. Create new transaction.
      await Transaction.create({
        userId: userId,
        amount: 1,
        type: "refund",
        description: `${ bookedClass.name } (${ format(bookedClass.date, "d/MM/y") }) at ${ format(currentDate, "d/MM/y HH:mm") } `,
      }, { transaction: t });
    }

    await t.commit();

    // 5. Alert users on waitlist for class.
    const waitlists = await Waitlist.findAll({ where: { classId: classId } });
    for (let i = 0; i < waitlists.length; i++) {
      const waitlist = waitlists[i];
      const user = await User.findOne({ where: { id: waitlist.userId } });
      // await sendEmail(user, bookedClass);  // NOTE: Normally would use sendEmail function, but didn't want Nodemailer error to prevent user from unbooking their class
      const emailHTML = `
      Hi ${ user.name },
      <br>
      <br>Great news! There is an open vacancy for your waitlisted class, ${ bookedClass.name } on ${ format(bookedClass.date, "d/MM/y HH:mm (EEE)") }.
      <br>
      <br>To secure your spot, please visit <a href="http://aerobics.nussportsclub.org/">our website</a> and book the class. Spaces are limited, so don't delay!
      <br>
      <br>If you have any questions or problems, please feel free to contact us at <a href="mailto:aerobics@nussportsclub.org">aerobics@nussportsclub.org</a>.
      <br>
      <br>Kindest regards,
      <br>NUS Aerobics`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "[NUS Aerobics] Claim your spot!",
        html: emailHTML,
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });
    }

    return NextResponse.json(
      { json: `Booking ${ id } deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { message: `${ error.message }` },
      { status: 500 }
    );
  }
}

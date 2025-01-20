import { NextResponse } from "next/server";

import db from "../../../config/sequelize";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

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
export async function DELETE(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { bookingId, classId, userId } = body;

    // 1. Delete booking.
    await Booking.destroy(
      {
        where: { id: bookingId },
        transaction: t
      }
    );

    // 2. Update class' booked capacity.
    const bookedClass = await Class.findOne(
      {
        where: { id: classId },
        transaction: t
      }
    );
    await Class.update(
      {
        bookedCapacity: bookedClass.bookedCapacity - 1
      },
      { where: { id: classId }, transaction: t });

    // 3. Update user's balance, only if cancelling before 12 hours.
    const user = await User.findOne({ where: { id: userId }, transaction: t });

    const utcDate = fromZonedTime(bookedClass.date, "Asia/Singapore");
    const sgDate = toZonedTime(utcDate, "Asia/Singapore");
    const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
    const cancelDeadline = new Date(sgDate.getTime() - 12 * 60 * 60 * 1000);
    const isAllowedCancel = sgCurrentDate < cancelDeadline;

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
        description: `Refunded '${ bookedClass.name }'`,
      }, { transaction: t });
    }

    // 5. Alert users on waitlist for class.
    const waitlists = await Waitlist.findAll({ where: { classId: classId }, transaction: t });
    for (let i = 0; i < waitlists.length; i++) {
      const waitlist = waitlists[i];
      const user = await User.findOne({ where: { id: waitlist.userId }, transaction: t });
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

    await t.commit();
    return NextResponse.json(
      { json: `Booking ${ bookingId } deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json(
      { message: `Error deleting booking: ${ error }` },
      { status: 500 }
    );
  }
}

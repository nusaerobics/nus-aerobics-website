import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");
let random = require("random-string-generator");

const db = require("../../../config/sequelize");
const User = db.users;

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

function sendEmail(user, tempPassword) {
  const emailHTML = `
      Hi ${ user.name },
      <br>
      <br>We received a request to reset your password on NUS Aerobics.
      <br>
      <br>Login with the temporary password below and reset your password in the Profile page.
      <table>
        <tr>
          <td><strong>Temporary password</strong></td>
          <td>${ tempPassword }</td>
        </tr>
      </table>
      <br>If you have any questions or problems, please contact us at <a href="mailto:aerobics@nussportsclub.org">aerobics@nussportsclub.org</a>.
      <br>
      <br>Kindest regards,
      <br>NUS Aerobics`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "[NUS Aerobics] Forgot your password?",
    html: emailHTML,
  };
  return transporter.sendMail(mailOptions);
}

export async function PUT(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { email } = body;
    const user = await User.findOne({ where: { email: email }, transaction: t });
    if (!user) {
      return NextResponse.json({ error: `No existing user with email ${ email }. Try again with an registered email.` }, { status: 400 });
    }

    const tempPassword = random(5, "upper");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);
    await User.update({ password: hashedPassword }, { where: { id: user.id }, transaction: t });

    await sendEmail(user, tempPassword);

    await t.commit()
    return NextResponse.json("Successful password reset request", { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback()
    return NextResponse.json({ error: `Error requesting password reset: ${ error.message }` }, { status: 500 });
  }
}

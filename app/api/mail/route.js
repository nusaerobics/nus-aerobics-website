import { NextResponse } from "next/server";

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, type, details } = body;

    let emailHTML;
    let subject;
    if (type === "forgot-password") {
      subject = "Forgot your password?";
      emailHTML = `
      Hi ${name}!
      <br>We received a request to reset your password on NUS Aerobics.
      <br>
      <br>Login with your temporary password and reset your password in the Profile page.
      <br><strong>Temporary password:</strong> ${details.tempPassword}
      <br>
      <br>If you have any questions or problems, please contact us at: aerobics@nussportsclub.org.
      <br>Kindest regards,
      <br>NUS Aerobics`;
    } else if (type === "handle-submission") {
      subject = "Update to your account balance";
      emailHTML = `
      Hi ${name}!
      <br>We have processed your form submission and have credited your account.
      <br>
      <br>If you have an existing account, you may log in with your existing details to see the updated balance.
      <br>If you had not created an account yet, we have created one for you. Please log in with your email address and your temporary password is set to your email address. After logging in, reset your password in the Profile page.
      <br>
      <br>If you have any questions or problems, please contact us at: aerobics@nussportsclub.org.
      <br>Kindest regards,
      <br>NUS Aerobics`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });
    return NextResponse.json("Email sent successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

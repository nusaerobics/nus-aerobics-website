import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const db = require("../../config/sequelize");
const Submission = db.submissions;
const User = db.users;
const Transaction = db.transactions;

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

function sendEmail(existingUser, user) {
  const accountDetails = (!existingUser)
    ? `We created an account for you with the following details:
       <br>
       <br>
        <table>
            <tr>
              <td><strong>Email</strong></td>
              <td>${ user.email.trim().toLowerCase() }</td>
            </tr>
            <tr>
              <td><strong>Password</strong></td>
              <td>${ user.email.trim().toLowerCase() }</td>
            </tr>
          </table>
        <br>After logging in, please reset your password in the Profile page.`
    : `You may log in with your existing details to see the updated balance.`

  const emailHTML = `
      Hi ${ user.name },
      <br>
      <br>Get ready to book classes! We're happy to update you that we have processed your form submission and credited your account.
      <br>
      <br>${ accountDetails }
      <br>
      <br>If you have any questions or problems, please feel free to contact us at <a href="mailto:aerobics@nussportsclub.org">aerobics@nussportsclub.org</a>.
      <br>
      <br>Kindest regards,
      <br>NUS Aerobics`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "[NUS Aerobics] It's payday!",
    html: emailHTML,
  };
  return transporter.sendMail(mailOptions);
}

// getSubmissions
export async function GET() {
  try {
    const submissions = await Submission.findAll();
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// createSubmission
export async function POST(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { submissionId, name, email, totalCredits } = body;

    // 1. If submission id not in db, continue. Else, don't need to continue.
    const existingSubmission = await Submission.findOne(
      { where: { submissionId: submissionId }, transaction: t }
    );
    if (existingSubmission) {
      return NextResponse.json(
        { error: `Submission ${submissionId} already exists.` },
        { status: 400 }
      );
    }

    // 2. Add submission to db with pending status.
    const newSubmission = await Submission.create(
      {
        submissionId: submissionId,
        email: email,
      },
      { transaction: t },
    );

    // 3. If user already exists, find user. Else, create new user with email.
    let user;
    const existingUser = await User.findOne(
      { where: { email: email }, transaction: t }
    );
    if (!existingUser) {
      const saltRounds = 10;
      const strippedEmail = email.trim().toLowerCase();
      const hashedPassword = await bcrypt.hash(strippedEmail, saltRounds);
      user = await User.create(
        {
          name: name,
          email: strippedEmail,
          password: hashedPassword,
        },
        { transaction: t },
      );
    } else {
      user = existingUser;
    }

    // 4. Update user's balance with total amount of credits.
    const newBalance = parseInt(user.balance) + parseInt(totalCredits);
    await User.update(
      { balance: newBalance },
      {
        where: { id: user.id },
        transaction: t,
      });

    // 5. Update submission status.
    await Submission.update({ status: "credited" }, { where: { id: newSubmission.id }, transaction: t });

    // 6. Create transaction.
    await Transaction.create({
      userId: user.id,
      amount: totalCredits,
      type: "deposit",
      description: `Deposited ${ totalCredits } credit(s)`
    }, { transaction: t });

    // 7. Email user to update about crediting.
    await sendEmail(existingUser, user);

    await t.commit();
    return NextResponse.json(`Handled submission ${ submissionId } for user ${ user.id }`, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ error: `${ error.message }` }, { status: 500 });
  }
}

// updateSubmission
export async function PUT(request) {
  try {
    const body = await request.json();
    const id = body.id;
    const status = body.status;

    const data = await Submission.update({
      status: status,
    }, { where: { id: id } });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Error updating submission: ${ error }` }, { status: 500 });
  }
}

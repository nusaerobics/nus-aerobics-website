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
  let isDuplicateSubmission = false;
  try {
    const body = await request.json();
    const { submissionId, name, email, totalCredits } = body;

    // 1. If submission id not in db, continue. else, don't need to continue.
    const existingSubmission = await Submission.findOne(
      { where: { submissionId: submissionId } },
      { t },
    );
    if (existingSubmission) {
      isDuplicateSubmission = true;
      throw new Error(`Submission ${ submissionId } already exists`);
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
      { where: { email: email } },
      { t },
    );
    if (!existingUser) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(email, saltRounds);
      user = await User.create(
        {
          name: name,
          email: email,
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
    const accountDetails = (!existingUser)
      ? `<br>We created an account for you with the following details:
        <br><strong>Email:</strong> ${ user.email }
        <br><strong>Password:</strong> ${ user.email }
        <br>After logging in, please reset your password in the Profile page.`
      : `You may log in with your existing details to see the updated balance.`

    const emailHTML = `
      Hi ${ name },
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
      to: email,
      subject: "[NUS Aerobics] It's payday!",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw new Error(`${ error }`);
      } else {
        console.log(info.response);
      }
    });

    await t.commit();
    return NextResponse.json(`Handled submission ${ submissionId } for user ${ user.id }`, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    if (isDuplicateSubmission) {
      return NextResponse.json({ error: `${ error.message }` }, { status: 400 });
    }
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

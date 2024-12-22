import {NextResponse} from "next/server";
import bcrypt from "bcrypt";

const db = require("../../config/sequelize");
const Submission = db.submissions;
const User = db.users;
const Transaction = db.transactions;

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

    // 1. if submission id not in db, continue. else, don't need to continue.
    const existingSubmission = await Submission.findOne(
      { where: { submissionId: submissionId } },
      { t },
    );
    if (existingSubmission) {
      throw new Error(`Submission ${submissionId} already exists`);
    }

    // 2. add submission to db with pending status.
    const newSubmission = await Submission.create(
      {
        submissionId: submissionId,
        email: email,
      },
      { transaction: t },
    );

    // 3. if user already exists, find user. else, create new user with email.
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

    // 4. update user's balance with total amount of credits.
    const newBalance = parseInt(user.balance) + parseInt(totalCredits);
    await User.update(
      { balance: newBalance },
      {
        where: { id: user.id },
        transaction: t,
      });

    // 5. update submission status.
    await Submission.update({ status: "credited" }, { where: { id: newSubmission.id }, transaction: t });

    // 6. create transaction.
    await Transaction.create({
      userId: user.id,
      amount: totalCredits,
      type: "deposit",
      description: `Deposited ${totalCredits} credit(s)`
    }, { transaction: t });

    await t.commit();
    return NextResponse.json(`Handled submission ${submissionId} for user ${user.id}`, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ error: `Error handling submission: ${error.message}` }, { status: 500 });
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
    return NextResponse.json({ error: `Error updating submission: ${error}` }, { status: 500 });
  }
}

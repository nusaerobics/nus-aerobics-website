import {NextResponse} from "next/server";

const db = require("../../config/sequelize");
const Submission = db.submissions;

// getSubmissions
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getSubmissionBySubmissionId
    if (searchParams.get("id") !== undefined) {
      const submissionId = searchParams.get("id");
      const submission = await Submission.findOne({ where: { submissionId: submissionId } });
      if (!submission) {
        throw new Error(`Submission ${submissionId} does not exist`);
      }
      return NextResponse.json(submission, { status: 200 });
    }

    const submissions = await Submission.findAll();
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// createSubmission
export async function POST(request) {
  try {
    const body = await request.json();
    const { submissionId, email } = body;
    const data = await Submission.create({
      submissionId: submissionId,
      email: email,
    })
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

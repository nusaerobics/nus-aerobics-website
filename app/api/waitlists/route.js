import { NextResponse } from "next/server";

const db = require("../../config/sequelize");
const Waitlist = db.waitlists;
const Class = db.classes;
const User = db.users;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getWaitlistsByUser
    if (searchParams.get("userId") !== undefined) {
      const userId = searchParams.get("userId");
      const userWaitlists = await Waitlist.findAll({
        where: { userId: userId },
        include: [
          {
            model: Class,
            required: true,
            as: "class",
          }
        ],
      });
      return NextResponse.json(userWaitlists, { status: 200 });
    }

    // TODO: Fix needed, not showing the user's information (Refer to Classes route)
    // getWaitlistsByClass
    if (searchParams.get("classId") !== undefined) {
      const classId = searchParams.get("classId");
      const classWaitlists = await Waitlist.findAll({
        where: { classId: classId },
        include: [
          {
            model: User,
            required: true,
            as: "user",
          }
        ]
      });
      return NextResponse.json(classWaitlists, { status: 200 });
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting waitlist(s): ${ error }` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await db.sequelize.transaction();
  try {
    const body = await request.json();
    const { classId, userId } = body;

    // 1. Check that the class is full
    const selectedClass = await Class.findOne({ where: { id: classId }, transaction: t });
    if (selectedClass.bookedCapacity < selectedClass.maxCapacity) {
      throw new Error(`Class ${ classId } is not fully booked.`);
    }

    // 2. Join waitlist
    const newWaitlist = await Waitlist.create({ classId: classId, userId: userId }, { transaction: t });
    await t.commit();
    return NextResponse.json(newWaitlist, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ error: `Error joining waitlist: ${ error.message }` }, { status: 500 })
  }
}

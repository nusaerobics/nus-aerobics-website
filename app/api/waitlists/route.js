import { NextResponse } from "next/server";

const db = require("../../config/sequelize");
const Waitlist = db.waitlists;
const Class = db.classes;

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

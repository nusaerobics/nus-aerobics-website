import { NextResponse } from "next/server";

const db = require("../../../config/sequelize");
const Waitlist = db.waitlists;

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const waitlist = await Waitlist.findOne({ where: { id: id } });
    if (waitlist === null) {
      throw new Error(`Waitlist ${ id } does not exist.`);
    }
    return NextResponse.json(waitlist, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Unable to get waitlist: ${ error.message }` });
  }
}

// deleteWaitlist
export async function DELETE(request, { params }) {
  const t = await db.sequelize.transaction();
  try {
    const id = await params.id;
    await Waitlist.destroy({ where: { id: id }, transaction: t });
    await t.commit();
    return NextResponse.json({ json: `Waitlist ${ id } deleted successfully` }, { status: 200 });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return NextResponse.json({ error: `Unable to delete waitlist: ${ error }` }, { status: 500 });
  }
}

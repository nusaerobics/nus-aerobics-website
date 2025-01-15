import { NextResponse } from "next/server";

const db = require("../../../config/sequelize")
const Class = db.classes;

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const c = await Class.findOne({ where: { id: id } });
    if (c == null) {
      throw new Error(`Class ${ id } does not exist`);
    }
    return NextResponse.json(c, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Unable to get class: ${ error.message }` });
  }
}

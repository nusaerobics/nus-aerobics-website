import { NextResponse } from "next/server";

const db = require("../../../config/sequelize")
const Class = db.classes;

export async function GET(request, { params }) {
  const id = await params.id;
  const targetClass = await Class.findOne({ where: { id: id } });
  if (!targetClass) {
    throw new Error(`Class ${ id } does not exist`);
  }
  return NextResponse.json(targetClass, { status: 200 });
}

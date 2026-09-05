import { NextResponse } from "next/server";
import db from "../../config/sequelize";
import { getSession } from "../../lib";

const Cancellation = db.cancellations;
const User = db.users;
const Class = db.classes;

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || session.user?.permission !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const where = {};
    if (status === "refundable") where.eligibleForRefund = true;
    if (status === "non-refundable") where.eligibleForRefund = false;

    const cancellations = await Cancellation.findAll({
      where,
      order: [["cancelledAt", "DESC"]],
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Class, as: "class", attributes: ["id", "name", "date"] },
      ],
    });
    return NextResponse.json(cancellations, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting cancellations: ${ error.message }` },
      { status: 500 },
    );
  }
}

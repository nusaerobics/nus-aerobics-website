import { NextRequest, NextResponse } from "next/server";
import Class from "../../models/class.model";
import { Op } from "sequelize";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    // getClassById
    if (searchParams.get("id") != undefined) {
      const id = searchParams.get("id");
      const targetClass = await Class.findOne({ where: { id: id } });
      if (!targetClass) {
        throw new Error(`Class ${id} does not exist`);
      }
      return NextResponse.json(targetClass, { status: 200 });
    }
    // getClasses
    // TODO: a) Convert to SGT and b) Test if it filters
    const now = new Date();
    const classes = await Class.findAll({ where: { date: { [Op.gte]: now } } });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting class(es): ${error}` },
      { status: 500 }
    );
  }
}
/**
 * TODO: Implement filter, sort, search on localStorage of getClasses
 * rather than calling getClasses repeatedly - when getClasses is called,
 * store it in localStorage
 * serverside in dataservices? "use server"
 */

// createClass
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const { name, description, date } = body;
    const data = await Class.create({
      name: name,
      description: description,
      date: date,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating class: ${error}` },
      { status: 500 }
    );
  }
}

// updateClass
export async function PUT(request) {
  // All values have to be inputted in request - either the unchanged values or updated values
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      date,
      max_capacity,
      booked_capacity,
      status,
    } = body;
    const data = await Class.update(
      {
        name: name,
        description: description,
        date: date,
        max_capacity: max_capacity,
        booked_capacity: booked_capacity,
        status: status,
      },
      { where: { id: id } }
    );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error updating class: ${error}` },
      { status: 500 }
    );
  }
}

// deleteClass
export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = body.id;
    await Class.destroy({ where: { id: id } });
    // TODO: Should I also delete bookings/transactions related to class?
    return NextResponse.json(
      { json: `Class ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error deleting class: ${error}` },
      { status: 500 }
    );
  }
}

import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { NextResponse } from "next/server";
import { Op, fn } from "sequelize";

const db = require("../../config/sequelize");
const Class = db.classes;

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
    
    const classes = await Class.findAll();

    // getTodayClasses /api/classes?isToday=true
    if (searchParams.get("isToday") != undefined) {
      const todayClasses = classes.filter((c) => {
        const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
        const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
        const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");

        const sgClassYear = sgClassDate.getFullYear();
        const sgClassMonth = sgClassDate.getMonth();
        const sgClassDay = sgClassDate.getDate();

        const sgCurrentYear = sgCurrentDate.getFullYear();
        const sgCurrentMonth = sgCurrentDate.getMonth();
        const sgCurrentDay = sgCurrentDate.getDate();

        return (
          sgClassYear == sgCurrentYear &&
          sgClassMonth == sgCurrentMonth &&
          sgClassDay == sgCurrentDay
        );
      });
      return NextResponse.json(todayClasses, { status: 200 });
    }

    // getClasses
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting class(es): ${error}` },
      { status: 500 }
    );
  }
}

// createClass
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const { name, description, date, status } = body;
    const data = await Class.create({
      name: name,
      description: description,
      date: date,
      status: status,
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
    const { id, name, description, date, maxCapacity, bookedCapacity, status } =
      body;
    const data = await Class.update(
      {
        name: name,
        description: description,
        date: date,
        maxCapacity: maxCapacity,
        bookedCapacity: bookedCapacity,
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

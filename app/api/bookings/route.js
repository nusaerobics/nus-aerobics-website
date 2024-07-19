import { NextRequest, NextResponse } from "next/server";
import Booking from "../../models/booking.model";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getBookingById
    if (searchParams.get("id") != undefined) {
      const id = searchParams.get("id");
      const booking = await Booking.findOne({ where: { id: id } }); // NOTE: When would I need a booking by ID?
      if (!booking) {
        throw new Error(`Booking ${id} does not exist`);
      }
      return NextResponse.json(booking, { status: 200 });
    }

    // getBookingsByUser
    if (searchParams.get("user_id") != undefined) {
      const user_id = searchParams.get("user_id");
      const userBookings = await Booking.findAll({
        where: { user_id: user_id },
      });
      return NextResponse.json(userBookings, { status: 200 });
    }

    // getBookingsByClass
    if (searchParams.get("class_id") != undefined) {
      const class_id = searchParams.get("class_id");
      const classBookings = await Booking.findAll({
        where: { class_id: class_id },
      });
      return NextResponse.json(classBookings, { status: 200 });
    }

    // getBookings
    const bookings = await Booking.findAll();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error getting booking(s): ${error}` },
      { status: 500 }
    );
  }
}

// TODO: Should be synchronous? Rather than asynchronous - but does it matter here or rather in component called
export async function POST(request) {
  /**
   * TODO: Handle checking if at moment of createBooking, if class
   * booked_capacity < max_capacity (Have to check especially if multiple
   * people book at the same time) - need to check request timing?
   */

  /**
   * error - Your booking could not be made as the class has reached max
   * capacity
   */

  /**
   * When user books class request,
   * 1. Check if booked_capacity < max_capacity
   * 2. Update class booked_capapcity += 1
   * 3. Create new booking
   * 4. Update class for status if needed
   */

  try {
    const body = await request.json();
    console.log(body);
    const { user_id, class_id, date } = body;
    const data = await Booking.create({
      user_id: user_id,
      class_id: class_id,
      date: date,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating booking: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, attendance } = body;
    const data = await Booking.update(
      { attendance: attendance },
      { where: { id: id } }
    );
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error updating booking: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = body.id;
    await Booking.destroy({ where: { id: id } });
    return NextResponse.json(
      { json: `Booking ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error deleting booking: ${error}` },
      { status: 500 }
    );
  }
}

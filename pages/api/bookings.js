import Booking from "../../database/models/booking.model";

export default (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      if (req.query.id != undefined) {
        return getBookingById(req, res);
      }
      if (req.query.user_id != undefined) {
        return getBookingsByUser(req, res);
      }
      if (req.query.class_id != undefined) {
        return getBookingsByClass(req, res);
      }
      return getBookings(req, res);
    case "POST":
      return createBooking(req, res); // Used to book a class
    case "PUT":
      return updateBooking(req, res); // Used to update class attendance
    case "DELETE":
      return deleteBooking(req, res); // Used to cancel booking
  }
};

const getBookings = async (req, res) => {
  Booking.findAll()
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting bookings: ${error}` });
    });
};

const getBookingById = async (req, res) => {
  const id = req.query.id;
  Booking.findOne({ where: { id: id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error getting booking ${id}: ${error}` });
    });
};

const getBookingsByUser = async (req, res) => {
  const user_id = req.query.user_id;
  Booking.findAll({ where: { user_id: user_id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error getting bookings for user ${user_id}: ${error}`,
      });
    });
};

const getBookingsByClass = async (req, res) => {
  const class_id = req.query.class_id;
  Booking.findAll({ where: { class_id: class_id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error getting bookings for class ${class_id}: ${error}`,
      });
    });
};

// TODO: Should be synchronous? Rather than asynchronous - but does it matter here or rather in component called
const createBooking = (req, res) => {
  const { user_id, class_id, bookingDate } = req.body;
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

  Booking.create({
    user_id: user_id,
    class_id: class_id,
    bookingDate: bookingDate,
  })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error occurred creating booking: ${error}` });
    });
};

const updateBooking = async (req, res) => {
  const { id, attendance } = req.body.id;
  await Booking.update({ attendance: attendance }, { where: { id: id } })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error occurred updating booking ${id}: ${error}` });
    });
};

const deleteBooking = async (req, res) => {
  const id = req.body.id;
  await Booking.destroy({ where: { id: id } }).catch((error) => {
    res
      .status(500)
      .json({ message: `Error occurred deleting booking ${id}: ${error}` });
  });
};

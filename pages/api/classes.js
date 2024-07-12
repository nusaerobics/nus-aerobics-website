import Class from "../../database/models/class.model";

/**
 * Functions which handle requests sent to /api/classes,
 * uses logic from Sequelize.
 */

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return getClasses(req, res);
    case "POST":
      return createClass(req, res);
  }
};

const getClasses = async (req, res) => {
  Class.findAll()
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    // TODO: Refer to tutorial to fix these functions
    .catch((error) => {
      res.status(500).json({ message: `Error getting all classes: ${error}` });
    });
};

const createClass = async (req, res) => {
  const { name, description, date } = req.body;
  Class.create({
    name: name,
    description: description,
    date: date,
    max_capacity: 19,
    booked_capacity: 0,
  })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error creating class: ${error}` });
    });
};

import { Op } from "sequelize";
import Class from "../../database/models/class.model";

// TODO: Refer to tutorial to fix what functions should return in .then() and .catch()

/**
 * Functions which handle requests sent to /api/classes,
 * uses logic from Sequelize.
 */

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      if (req.query.id != undefined) {
        return getClassById(req, res);
      }
      return getClasses(req, res);
    case "POST":
      return createClass(req, res);
    case "PUT":
      return updateClass(req, res);
    case "DELETE":
      return deleteClass(req, res);
  }
};

const getClasses = async (req, res) => {
  // TODO: a) Convert to SGT and b) Test if it filters
  const now = new Date();
  await Class.findAll({ where: { date: { [Op.gte]: now } } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting classes: ${error}` });
    });
};
/**
 * TODO: Implement filter, sort, search on localStorage of getClasses
 * rather than calling getClasses repeatedly - when getClasses is called,
 * store it in localStorage
 *  */

const getClassById = async (req, res) => {
  const id = req.query.id;
  await Class.findOne({ where: { id: id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error occurred getting class ${id}: ${error}` });
    });
};

const createClass = async (req, res) => {
  const { name, description, date } = req.body;
  await Class.create({
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
      res
        .status(500)
        .json({ message: `Error occurred creating class: ${error}` });
    });
};

const updateClass = async (req, res) => {
  // All values have to be inputted in request - either the unchanged values or updated values
  const { id, name, description, date, booked_capacity, status } = req.body;
  await Class.update(
    {
      name: name,
      description: description,
      date: date,
      booked_capacity: booked_capacity,
      status: status,
    },
    { where: { id: id } }
  )
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error occurred updating class ${id}: ${error}` });
    });
};

const deleteClass = async (req, res) => {
  const id = req.body.id;
  await Class.destroy({ where: { id: id } }).catch((error) => {
    res
      .status(500)
      .json({ message: `Error occurred deleting class ${id}: ${error}` });
  });
};

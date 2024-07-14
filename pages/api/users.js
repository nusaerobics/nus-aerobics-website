import User from "../../database/models/user.model";

/**
 * Functions which handle requests sent to /api/users,
 * uses logic from Sequelize.
 */

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
  }
};

const getUsers = async (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting all users: ${error}` });
    });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({
      name: name,
      email: email,
      password: password,
      permission: "normal",
      balance: 0,
  })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error creating user: ${error}` });
    });
};

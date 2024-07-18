import User from "../../database/models/user.model";
const bcrypt = require("bcrypt");

/**
 * Functions which handle requests sent to /api/users,
 * uses logic from Sequelize.
 */

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      // TODO: Handle login/authentication here?
      if (req.query.id != undefined) {
        return getUserById(req, res);
      }
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
    case "UPDATE":
      if (req.body.permission != undefined) {
        return updateUserAdmin(req, res);
      }
      if (req.body.password != undefined) {
        return updateUserPassword(req, res);
      }
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);
  }
};

const getUsers = async (req, res) => {
  await User.findAll()
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting all users: ${error}` });
    });
};

const getUserById = async (req, res) => {
  const id = req.query.id;
  await User.findOne({ where: { id: id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting all users: ${error}` });
    });
};

const createUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // TODO: Error is occurring here
  // const isExistingEmail = await User.findAll({ where: { email: email } });
  // // TODO: Check if email is unique
  // if (isExistingEmail) {
  //   return res
  //     .status(500)
  //     .json({ message: "Error creating user: Email already registered" });
  // }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error creating user: ${error}` });
    });
};

const updateUser = async (req, res) => {
  const id = req.body.id;
  const name = req.body.user;
  const email = req.body.email;
  // const password = req.body.password;  // TODO: Could also be null if they don't change their password?
  let updates;

  // Update coming from user book/cancel class
  if (req.body.balance != undefined) {
    const balance = req.body.balance;
    updates = {
      name: name,
      email: email,
      balance: balance,
    };
  } else {
    updates = {
      name: name,
      email: email,
    };
  }
  await User.update(updates, { where: { id: id } })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `[User-related] Error occurred updating user ${id}: ${error}`,
      });
    });
};

const updateUserAdmin = async (req, res) => {
  const { id, permission, balance } = req.body;
  await User.update(
    { permission: permission, balance: balance },
    { where: { id: id } }
  )
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `[Admin related] Error occurred updating user ${id}: ${error}`,
      });
    });
};

const updateUserPassword = async (req, res) => {
  const { id, password } = req.body;
  // TODO: Handle checking if new password matches old password
  // TODO: Add in bcrypt for password
  await User.update({ password: password }, { where: { id: id } })
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error occurred updating password for user ${id}: ${error}`,
      });
    });
};

const deleteUser = async (req, res) => {
  const id = req.body.id;
  await User.destroy({ where: { id: id } }).catch((error) => {
    res
      .status(500)
      .json({ message: `Error occurred deleting user ${id}: ${error}` });
  });
};

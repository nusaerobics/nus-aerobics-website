import User from "../../app/models/user.model";

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      return getUsers(req, res);
    case "POST":
      return createUser(req, res);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const getUsers = async (req, res) => {
  User.findAll().then((data) => {
    res.send(data);
    res.status(200).json({ json: data });
  });
};

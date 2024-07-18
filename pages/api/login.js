import { NextApiRequest, NextApiResponse } from "next"; // TODO: What do I use this for?
import User from "../../database/models/user.model";
import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (user === undefined) {
      return res.status(400).json({ message: `No matching record of user with email ${email}` });
    }

    const userPassword = user.password;
    const isMatchingPassword = await bcrypt.compare(password, userPassword);
    if (!isMatchingPassword) {
      return res.status(400).json({ message: `Invalid credentials` });
    }

    // Adding in JWT
    const tokenData = {
      id: user.id,
      email: user.email,
      permission: user.permission,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ success: true }).cookies.set("token", token, { httpOnly: true })

  } catch (error) {
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      res.status(500).json({ error: `Error occurred during login: ${error}` });
    }
  }
}

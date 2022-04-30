import { Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import Users from "../entities/Users";
import bcrypt = require("bcrypt");

const register = async (req: Request, res: Response) => {
  const { username, password, confirmPassword, firstname, lastname, email } =
    req.body;

  let errors: any = {};

  let isUsernameAvailable: Users;
  let isEmailAvailable: Users;

  isUsernameAvailable = await Users.findOne({ username });
  isEmailAvailable = await Users.findOne({ email });

  if (isUsernameAvailable) errors.username = "Username taken";
  if (isEmailAvailable) errors.email = "Email taken";

  if (password !== confirmPassword)
    errors.password = "Password and ConfirmPassword must match!";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = getRepository(Users).create({
      username,
      password,
      firstname,
      lastname,
      email,
    });
    const result = await user.save();
    return res.json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username) || isEmpty(password)) {
      return res.status(400).json("Username/password must not be empty!");
    }

    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username!");
    }

    if (user) {
      const hashedPassword = await bcrypt.compare(password, user.password);

      if (!hashedPassword) return res.status(401).json("Invalid password!");

      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);

export { router as authRouter };

import { IUser } from "./../../libs/interface/user";
import {
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  newUser,
  updateUser,
} from "@/libs/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;
  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (method === "create") {
    const { username, email, pass1, pass2, userToken, walletAddress } =
      req.body;

    if (
      !username ||
      !email ||
      !pass1 ||
      !pass2 ||
      !userToken ||
      !walletAddress
    ) {
      res.status(400).json({ status: false, message: "Missing data" });
      return;
    }

    if (pass1 !== pass2) {
      res
        .status(400)
        .json({ status: false, message: "Passwords do not match" });
      return;
    }

    if (pass1.length < 6) {
      res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const user = await newUser(
      username,
      email,
      pass1,
      pass2,
      userToken,
      walletAddress
    );
    if (!user) {
      res.status(400).json({ status: false, message: "Action Failed" });
      return;
    }
    res.status(200).json({ status: true, message: "User created", user: user });
  }

  if (method === "login") {
    const { email, pass } = req.body;
    const user = await loginUser(email);
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    if (user.user.pass1 !== pass) {
      res.status(400).json({ message: "Wrong password" });
      return;
    }
    res.status(200).json({ message: "User logged in", user: user });
  }

  if (method === "getOne") {
    const { userToken } = req.body;
    const user = await getUser(userToken);
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    res.status(200).json({ message: "User found", user: user });
  }

  if (method === "getAll") {
    const users = await getAllUsers();
    if (!users.success) {
      res.status(400).json({ message: users.message });
      return;
    }
    res.status(200).json({ message: "Users found", users: users });
  }

  if (method === "update") {
    const {
      userToken,
      username,
      email,
      pass1,
      pass2,
      deposit,
      img,
      admin,
      newPassToken,
      maticBalance,
      walletAddress,
    } = req.body;
    const user = await updateUser(
      userToken,
      username,
      email,
      pass1,
      pass2,
      deposit,
      img,
      admin,
      newPassToken,
      maticBalance,
      walletAddress
    );
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    res.status(200).json({ message: "User updated", user: user });
  }

  if (method === "delete") {
    const { userToken } = req.body;
    const user = await deleteUser(userToken);
    if (!user.success) {
      res.status(400).json({ status: false, message: user.message });
      return;
    }
    let resUser = user.pasifUser;
    return res.status(200).json({ status: true, user: resUser });
  }
}

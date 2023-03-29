import {
  getBetHistories,
  getAllBetHistories,
  getAllBetHistoriesforUser,
} from "@/libs/models/betHistory";

import { User } from "@/libs/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    return res.status(200).json({
      status: false,
      message: "API Key is not valid",
    });
  }

  if (method === "getOne") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const betHistory = await getBetHistories(_id);
    if (!betHistory) {
      return res.status(200).json({
        status: false,
        message: "Bet Histories request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Bet Histories request successful",
      betHistory,
    });
  }

  if (method === "getAll") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const betHistories = await getAllBetHistories();
    if (!betHistories) {
      return res.status(200).json({
        status: false,
        message: "Bet histories request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Bet histories request successful",
      betHistories,
    });
  }


  if (method === "getAllforUser") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const betHistories = await getAllBetHistoriesforUser(user.email);
    if (!betHistories) {
      return res.status(200).json({
        status: false,
        message: "Bet histories request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Bet histories request successful",
      betHistories,
    });
  }  

  return res.status(400).json({ message: "Missing required fields" });
}

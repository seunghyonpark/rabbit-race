import { IGame } from "./../../libs/interface/game";
import {
  deleteGames,
  deleteOneGame,
  getGameByToken,
  getGames,
  newGame,
} from "@/libs/models/game";
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

  if (method === "newGame") {
    const { userToken, username, img, betAmount, selectedSide } = req.body;
    if (!userToken || !username || !img || !betAmount || !selectedSide) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const addedGame = await newGame(
      userToken,
      username,
      img,
      betAmount,
      selectedSide
    );
    if (addedGame.success) {
      return res.status(200).json({ message: "Success", addedGame });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "getGames") {
    const games = await getGames();
    if (games) {
      return res.status(200).json({ message: "Success", games });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "deleteAll") {
    const games = await deleteGames();
    if (games) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "deleteOne") {
    const { userToken, selectedSide } = req.body;
    if (!userToken || !selectedSide) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const game = await deleteOneGame(userToken, selectedSide);
    if (game) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(400).json({ message: "Action Failed" });
  }
  if (method === "getGameByToken") {
    const { userToken } = req.body;
    if (!userToken) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const game = await getGameByToken(userToken);
    if (game) {
      return res.status(200).json({ message: "Success", game });
    }
    return res.status(400).json({ message: "Action Failed" });
  }
}

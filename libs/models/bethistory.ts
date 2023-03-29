import { IHistory } from "./../interface/historyInterface";
import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";

connectMongo();

const BetHistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
});

export const BetHistoryModel =
  models.History || model<IHistory>("History", BetHistorySchema);

export const newHistory = async (
  winnerHorse: string,
  placements: { line: number; horse: string }[]
): Promise<IHistory> => {
  const history = new BetHistoryModel({ winnerHorse, placements });
  return await history.save();
};

export const getHistory = async (): Promise<IHistory[]> => {
  return await BetHistoryModel.find().sort({ date: -1 }).limit(20);
};

export const getLastHistory = async (): Promise<IHistory> => {
  return await BetHistoryModel.findOne().sort({ date: -1 });
};

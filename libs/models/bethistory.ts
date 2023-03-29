import mongoose, { model, models, Schema } from "mongoose";
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
  basePrice: {
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

  prizeAmount: {
    type: Number,
    required: true,
  },
  depositBefore: {
    type: Number,
    required: true,
  },
  depositAfter: {
    type: Number,
    required: true,
  },

});





export const BetHistory =
  models.BetHistory || model("BetHistory", BetHistorySchema);



export const getBetHistories = async (_id: string) => {
  const request = await BetHistory.find({ _id });
  if (request) {
    return request;
  } else {
    return null;
  }
};

export const getAllBetHistories = async () => {
  const requests = await BetHistory.find();
  if (requests) {
    return requests;
  } else {
    return null;
  }
};

export const getAllBetHistoriesforUser = async (email1: string) => {
  const requests = await BetHistory.find({ email1: email1, date: -1 });
  if (requests) {
    return requests;
  } else {
    return null;
  }
};

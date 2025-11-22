import mongoose from "mongoose";

export const pacEventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export const pacEvent = mongoose.model("PacEvent", pacEventSchema, "pac-event");

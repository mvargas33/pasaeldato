import mongoose from "mongoose";
import { LocationSchema } from "../schemas/location";
import { updateTimestampPreSave, deduplicateObjectIds, deduplicateStrings } from "../utils/schema-helpers";

export const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  colour: {
    type: String,
    trim: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CommunitySchema.index({ "location.point": "2dsphere" });
CommunitySchema.index({ name: "text", description: "text" });
CommunitySchema.index({ tags: 1 });
CommunitySchema.index({ createdAt: -1 });

CommunitySchema.pre("save", function (next) {
  updateTimestampPreSave.call(this);
  if (this.isModified("members") || this.isNew) {
    this.members = deduplicateObjectIds(this.members);
  }
  if (this.isModified("tags") || this.isNew) {
    this.tags = deduplicateStrings(this.tags);
  }
  next();
});

export const Community = mongoose.models.Community || mongoose.model("Community", CommunitySchema);


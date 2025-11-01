import mongoose, { Schema } from "mongoose";

const commentSchema = await new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);

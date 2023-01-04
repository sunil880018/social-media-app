import { Schema, model } from "mongoose";
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: Schema.Types.ObjectId,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    postId: Schema.Types.ObjectId,
    postUserId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", CommentSchema);
export { Comment };

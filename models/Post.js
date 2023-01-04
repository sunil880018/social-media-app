import { Schema, model } from "mongoose";
const PostSchema = new Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", PostSchema);
export { Post };

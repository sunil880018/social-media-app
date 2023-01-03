import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    recipients: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Conversation = model("Conversation", ConversationSchema);
export { Conversation };

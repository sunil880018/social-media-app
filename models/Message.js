import { Schema, model } from "mongoose";
const MessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);
const Message = model("Message", MessageSchema);
export { Message };

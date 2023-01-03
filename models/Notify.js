import { Schema, model } from "mongoose";

const NotifySchema = new Schema(
  {
    id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipients: [Schema.Types.ObjectId],
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Notify = model("Notify", NotifySchema);
export { Notify };

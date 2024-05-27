import mongoose, { Document, Schema } from "mongoose";

export interface ITask {
  name: string;
  email: string;
  password: string;
  generateToken?: (user: any) => string;
}

export interface ITaskModel extends ITask, Document {}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["unstarted", "inprogress", "complete"],
      required: true,
      default: "unstarted",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITaskModel>("Task", TaskSchema);

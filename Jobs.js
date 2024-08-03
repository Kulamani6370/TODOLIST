import mongoose from "mongoose";
// import { nanoid } from "nanoid";

const JobSchema = new mongoose.Schema({
  title: String,
  isDone: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Job", JobSchema);

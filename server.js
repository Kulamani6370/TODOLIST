import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import Job from "./Jobs.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
  res.json({ msg: "test route" });
});
app.get("/", async (req, res) => {
  const Jobs = await Job.find();
  if (!Jobs) res.send("There is no works to do");

  res.send(Jobs);
});
app.post("/", async (req, res) => {
  const { title, isDone } = req.body;
  const job = await Job.create({ title: title, isDone: isDone });
  res.send(job);
});
app.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: "Job updated succesfully", job: updatedJob });
  }
});
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Job.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Todo item deleted successfully", id });
    } else {
      res.status(404).json({ error: "Todo item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting the todo item", details: error });
  }
});

try {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.MONGOURL);
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
} catch (error) {
  console.log(error);
}

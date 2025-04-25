import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  evalName: { type: String, required: true },
  grade: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Grade", GradeSchema);
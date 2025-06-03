import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  userId: { type: String, required: true },     // Clerk user ID
  course: { type: String, required: true },     // New field for course (e.g. COMP310)
  evalName: { type: String, required: true },
  grade: { type: Number, required: true },      // grade
  weight: { type: Number, required: true },     // weight
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Grade", GradeSchema);
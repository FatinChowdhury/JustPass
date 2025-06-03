import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import GradeSchema from './models/Grade.js';
// import GradesRouter from "./routes/grades.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";



const app = express();
// What it does: Allows cross-origin requests 
// (e.g., from a frontend at http://localhost:3000 to a backend at http://localhost:3001)
// like in our case
app.use(cors());

// What it does: Parses incoming JSON data from 
// HTTP requests (e.g., POST, PUT) and makes it available in req.body.
app.use(express.json());
// Order: cors() first (to allow requests), then express.json() (to parse them).


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    mongoose.connection.once('open', () => {
      console.log("MongoDB connection established successfully.");
    });

    mongoose.connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
    });
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
    // REMOVED
  }
}
run().catch(console.dir);


// mongoose.connect("mongodb://localhost:27017/gradeTracker");
// mongoose.connection.on("connected", () => {
//     console.log("MongoDB connected successfully!");
// });

// mongoose.connection.on("error", (err) => {
//     console.error("MongoDB connection error:", err);
// });

// ROUTES
// app.use("/api/grades", GradesRouter)
app.get("/", ClerkExpressRequireAuth(), (req, res) => {
    const courseFilter = req.query.course;
    const userId = req.auth.user.id;
    let filter = { userId };
    if (courseFilter) filter.course = {$regex: courseFilter, $options: 'i'}; // case insensitive regex
    const grades = GradeSchema.find(filter);
    grades
      .then((grades) => {
          if (!grades || grades.length === 0) {
            return res.status(200).json([]);
          }
          return res.status(200).json(grades);
      })
      .catch((error) => res.status(500).json( { message: "Error fetching grades", error: error.message }));
});

app.post("/", ClerkExpressRequireAuth(), (req, res) => {
  const { course, evalName, grade, weight } = req.body;
  if (!course || !evalName || grade == null || weight == null) {
    return res.status(400).json({ message : "Error: Missing required fields" });
  }
  const newGrade = new GradeSchema( {
    userId: req.auth.user.id,
    course,
    evalName,
    grade,
    weight
  });
  newGrade.save()
    .then(() => res.status(201).json(newGrade))
    .catch((error) => res.status(500).json( {message: "Error saving grade", error: error.message} ));
});

app.put("/:id", ClerkExpressRequireAuth(), (req, res) => {
  const { course, evalName, grade, weight } = req.body;
  if (!course || !evalName || grade == null || weight == null) {
    return res.status(400).json({ message: "Error: Missing required fields" });
  }
  GradeSchema.findByIdAndUpdate(
    req.params.id,
    { course, evalName, grade, weight },
    { new: true }
  )
    .then((updatedGrade) => {
      if (!updatedGrade) {
        return res.status(404).json({ message: "Grade not found" });
      }
      res.status(200).json(updatedGrade);
    })
    .catch((error) => res.status(500).json( {message: "Error updating grade", error: error.message} ));
 });

app.delete("/:id", ClerkExpressRequireAuth(), (req, res) => {
  GradeSchema.findByIdAndDelete(req.params.id)
    .then((deletedGrade) => {
      if (!deletedGrade) {
        return res.status(404).json({ message: "Grade not found" });
      }
      res.status(200).json({ message: "Grade deleted successfully" });
    })
    .catch((error) => res.status(500).json( {message: "Error deleting grade", error: error.message} ));
});




app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
import express from 'express';
import GradeSchema from '../models/Grade.js';
// import { gradesCacheMiddleware } from '../middleware/gradesCache.js'; 
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
const router = express.Router();


// get grade, filtered by course
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
    console.log("Received GET request to /api/grades");
    try {
        const course = req.query.course;
        let filter = {userId: req.auth.user.id};
        if (course) filter.course = {$regex: course, $options: 'i'}; // case insensitive regex
        const grades = await GradeSchema.find(filter);
        if (!grades) {
            res.status(200).json([]);
        }
        return res.status(200).json(grades);
    } catch (error) {
        console.error("Error in GET /api/grades:", error);
        res.status(500).json({ 
            message: "Error fetching grades",
            error: error.message    
        });
    }
});

// add a grade
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {

    const { course, evalName, grade, weight } = req.body;
    if (!course || !evalName || grade == null || weight == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newGrade = new GradeSchema({
            userId: req.auth.user.id,
            course,
            evalName,
            grade,
            weight
        });
        await newGrade.save();
        res.status(201).json(newGrade);
    } catch (error) {
        res.status(400).json({ message: "Error saving grade" });
    }
 });

 // update a grade
//  router.put("/:id", async (req, res) => {
//     const { assignmentName, grade } = req.body;
//     try {
//         const updatedGrade = await Grade.findByIdAndUpdate(
//             req.params.id,
//             { assignmentName, grade },
//             { new: true }
//         );
//         if (!updatedGrade) {
//             return res.status(404).json({ message: "Grade not found" });
//         }
//         res.json(updatedGrade);
//     } catch (error) {
//         res.status(400).json({ message: "Error updating grade" });
//     }
//  });

// delete a grade
// router.delete("/:id", async (req, res) => {
//     try {
//         const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
//         if (!deletedGrade) {
//             return res.status(404).json({ message: "Grade not found" });
//         }
//         res.json(deletedGrade);
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting grade" });
//     }
// });

export default router;
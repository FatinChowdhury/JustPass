import express from 'express';
import GradeSchema from '../models/Grade.js';
import { gradesCacheMiddleware } from '../middleware/gradesCache.js'; 

const router = express.Router();

// get grade
router.get("/", gradesCacheMiddleware, async (req, res) => {
    try {
        const grades = await GradeSchema.find( { userId: req.auth.user.id } );
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: "Error fetching grades" });
    }
});

// add a grade
router.post("/", async (req, res) => {

    const { evalName, grade } = req.body;
    try {
        const newGrade = new GradeSchema({
            userId: req.auth.user.id,
            evalName,
            grade
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

export default GradesRouter;
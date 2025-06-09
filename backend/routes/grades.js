import express from 'express';
import Grade from '../models/Grade.js';
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
        const grades = await Grade.find(filter);
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
        const newGrade = new Grade({
            userId: req.auth.user.id,
            course,
            evalName,
            grade,
            weight
        });
        await newGrade.save();
        res.status(201).json(newGrade);
    } catch (error) {
        console.error("Error in POST /api/grades:", error);
        res.status(400).json({ message: "Error saving grade", error: error.message });
    }
 });

 // update a grade
router.put("/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const { course, evalName, grade, weight } = req.body;
    if (!course || !evalName || grade == null || weight == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    try {
        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id,
            { course, evalName, grade, weight },
            { new: true }
        );
        if (!updatedGrade) {
            return res.status(404).json({ message: "Grade not found" });
        }
        res.json(updatedGrade);
    } catch (error) {
        console.error("Error in PUT /api/grades/:id:", error);
        res.status(400).json({ message: "Error updating grade", error: error.message });
    }
 });

// delete a grade
router.delete("/:id", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
        if (!deletedGrade) {
            return res.status(404).json({ message: "Grade not found" });
        }
        res.json(deletedGrade);
    } catch (error) {
        console.error("Error in DELETE /api/grades/:id:", error);
        res.status(500).json({ message: "Error deleting grade", error: error.message });
    }
});

export default router;
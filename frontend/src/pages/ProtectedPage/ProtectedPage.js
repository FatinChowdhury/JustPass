import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserButton, useAuth } from "@clerk/clerk-react";
import "./protectedpage.css"; // Make sure to import your CSS file
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
// import { response } from "express"; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// API base URL configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production 
  : 'http://localhost:3001'; // Use full URL in development

const ProtectedPage = () => {
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [remainingWeight, setRemainingWeight] = useState("");
  const [requiredGrade, setRequiredGrade] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    course: "",
    evalName: "",
    grade: "",
    weight: ""
  });
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");

  const { getToken } = useAuth();

  const fetchGrades = useCallback(async (courseFilter = selectedCourse) => {
    try {
      const token = await getToken();
      const url = courseFilter ? `${API_BASE_URL}/api/grades?course=${encodeURIComponent(courseFilter)}` : `${API_BASE_URL}/api/grades`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGrades(response.data);
    }
    catch (error) {
      console.error("Error fetching grades:", error);
    }
  }, [getToken, selectedCourse]);

  //listen to id change in route, then trigger fetch class

  useEffect(() => {
    fetchGrades();
  }, [getToken, selectedCourse, fetchGrades]);

  const handleAdd = async () => {
    if (!selectedCourse) {
      alert("Please select a course from the sidebar first, or create a new course");
      return;
    }
    
    if (!name || isNaN(grade) || isNaN(weight)) return;
    const newWeight = parseFloat(weight);
    const currentWeight = grades.reduce((acc, g) => acc + g.weight, 0);

    if (currentWeight + newWeight > 100) {
        alert("Total weight cannot exceed 100%");
        return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE_URL}/api/grades`, {
        course: selectedCourse,
        evalName: name,
        grade: parseFloat(grade),
        weight: newWeight
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGrades([...grades, response.data]);
      setName("");
      setGrade("");
      setWeight("");
    } catch (error) {
      alert("Error adding grade: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (gradeItem) => {
    setEditingId(gradeItem.id);
    setEditForm({
      course: gradeItem.course,
      evalName: gradeItem.evalName,
      grade: gradeItem.grade,
      weight: gradeItem.weight
    });
  };

  const handleUpdate = async () => {
    if (!editForm.evalName || isNaN(editForm.grade) || isNaN(editForm.weight) || !editForm.course) {
      alert("Please fill in all fields correctly");
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.put(`${API_BASE_URL}/api/grades/${editingId}`, {
        course: editForm.course,
        evalName: editForm.evalName,
        grade: parseFloat(editForm.grade),
        weight: parseFloat(editForm.weight)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGrades(grades.map(g => g.id === editingId ? response.data : g));
      setEditingId(null);
      setEditForm({ course: "", evalName: "", grade: "", weight: "" });
    } catch (error) {
      alert("Error updating grade: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_BASE_URL}/api/grades/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGrades(grades.filter(g => g.id !== id));
    } catch (error) {
      alert("Error deleting grade: " + (error.response?.data?.message || error.message));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ course: "", evalName: "", grade: "", weight: "" });
  };

  const handleNewCourse = () => {
    if (newCourseName.trim()) {
      setSelectedCourse(newCourseName.trim());
      setShowNewCourseModal(false);
      setNewCourseName("");
      // Clear existing grades for the new course view
      setGrades([]);
    }
  };

  const cancelNewCourse = () => {
    setShowNewCourseModal(false);
    setNewCourseName("");
  };

  const calculateWeightedGrade = (subset) => {
    let totalWeight = 0;
    let weightedSum = 0;
    subset.forEach(({ grade, weight }) => {
      weightedSum += grade * weight;
      totalWeight += weight;
    });
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const calculateNeededGrade = () => {
    const targetGrade = parseFloat(target);
    const finalWeight = parseFloat(remainingWeight);
    const currentWeight = grades.reduce((acc, g) => acc + g.weight, 0);
    const currentWeightedScore = grades.reduce((acc, g) => acc + g.grade * g.weight, 0);

    if (currentWeight + finalWeight !== 100) {
      alert("Total weight (existing + final) must be exactly 100%");
      return;
    }

    const needed = (targetGrade * 100 - currentWeightedScore) / finalWeight;
    // setRequiredGrade(needed > 0 ? needed : 0);
    setRequiredGrade(needed.toFixed(2));

  }

  // Get unique courses for sidebar
  const uniqueCourses = [...new Set(grades.map(g => g.course))];

  const chartData = {
    labels: grades.map((g) => g.evalName),
    datasets: [
      {
        label: `Cumulative Grade (%)${selectedCourse ? ` - ${selectedCourse}` : ''}`,
        data: grades.map((_, i) => calculateWeightedGrade(grades.slice(0, i + 1)).toFixed(2)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Courses</h3>
          <button 
            className="add-course-btn"
            onClick={() => setShowNewCourseModal(true)}
            title="Add New Course"
          >
            +
          </button>
        </div>
        <div className="course-list">
          <button 
            className={`course-item ${selectedCourse === "" ? "active" : ""}`}
            onClick={() => setSelectedCourse("")}
          >
            All Courses
          </button>
          {uniqueCourses.map((courseName, index) => (
            <button
              key={index}
              className={`course-item ${selectedCourse === courseName ? "active" : ""}`}
              onClick={() => setSelectedCourse(courseName)}
            >
              {courseName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="grade-tracker">
          <UserButton />
          <h2>JustPass</h2>
          <div className="input-row">
            {selectedCourse && (
              <div className="selected-course-indicator">
                Adding to: <strong>{selectedCourse}</strong>
              </div>
            )}
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Assessment" />
            <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade %" type="number" />
            <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight %" type="number" />
            <button onClick={handleAdd} disabled={!selectedCourse}>
              Add to {selectedCourse || "Select Course"}
            </button>
          </div>

          <div className="summary">
            <p>
              Current Final Grade:{" "}
              <strong>{calculateWeightedGrade(grades).toFixed(2)}%</strong>
            </p>
            <p>
              Total Weight Used: <strong>{grades.reduce((acc, g) => acc + g.weight, 0)}%</strong>
            </p>
          </div>

          {grades.length > 0 && (
            <div className="grades-list">
              <h3>Your Grades {selectedCourse && `- ${selectedCourse}`}:</h3>
                             {grades.map((g) => (
                 <div key={g.id} className="grade-item">
                   {editingId === g.id ? (
                    // Edit mode
                    <div className="edit-form">
                      <input 
                        value={editForm.course} 
                        onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                        placeholder="Course"
                      />
                      <input 
                        value={editForm.evalName} 
                        onChange={(e) => setEditForm({...editForm, evalName: e.target.value})}
                        placeholder="Assessment"
                      />
                      <input 
                        value={editForm.grade} 
                        onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                        placeholder="Grade %"
                        type="number"
                      />
                      <input 
                        value={editForm.weight} 
                        onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                        placeholder="Weight %"
                        type="number"
                      />
                      <button onClick={handleUpdate} className="save-btn">Save</button>
                      <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                    </div>
                  ) : (
                    // View mode
                    <div className="grade-display">
                      <span>{g.course} - {g.evalName}: {g.grade}% (Weight: {g.weight}%)</span>
                      <div className="grade-actions">
                        <button onClick={() => handleEdit(g)} className="edit-btn">Edit</button>
                                                 <button onClick={() => handleDelete(g.id)} className="delete-btn">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Line data={chartData} />
          <div className="predictor">
              <h3>What do I need on my final?</h3>
              <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Target Grade %"
                  type="number"
              />
              <input
                  value={remainingWeight}
                  onChange={(e) => setRemainingWeight(e.target.value)}
                  placeholder="Final Exam Weight %"
                  type="number"
              />
              <button onClick={calculateNeededGrade}>Calculate</button>
              {requiredGrade && (
                  <p>
                      You need <strong>{requiredGrade}%</strong> on your final to get <strong>{target}%</strong> overall.
                  </p>
              )}
          </div>
        </div>
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Course</h3>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Enter course name (e.g., COMP310)"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={handleNewCourse} disabled={!newCourseName.trim()}>
                Add Course
              </button>
              <button onClick={cancelNewCourse} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProtectedPage;
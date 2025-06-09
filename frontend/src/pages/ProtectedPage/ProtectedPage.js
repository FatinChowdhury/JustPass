import React, { useState, useEffect } from "react";
import axios from "axios";
import { Protect, UserButton, useAuth } from "@clerk/clerk-react";
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

const ProtectedPage = () => {
  const [grades, setGrades] = useState([]);
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [remainingWeight, setRemainingWeight] = useState("");
  const [requiredGrade, setRequiredGrade] = useState(null);

  const { getToken } = useAuth();

  const fetchGrades = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('/api/grades', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGrades(response.data);
    }
    catch (error) {
      // Error fetching grades
    }
  }

  //listen to id change in route, then trigger fetch class

  useEffect(() => {
    fetchGrades();
  }, [getToken]);

  const updateGrades = async () => {
    try {
      const token = await getToken();
      const response = await axios.put('/api/grades', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGrades(response.data);
    } catch (error) {
      // Error updating grades
    }
  };

  const handleAdd = async () => {
    if (!name || isNaN(grade) || isNaN(weight) || !course) return;
    const newWeight = parseFloat(weight);
    const currentWeight = grades.reduce((acc, g) => acc + g.weight, 0);

    if (currentWeight + newWeight > 100) {
        alert("Total weight cannot exceed 100%");
        return;
    }

    try {
      const token = await getToken();
      const response = await axios.post('/api/grades', {
        course,
        evalName: name,
        grade: parseFloat(grade),
        weight: newWeight
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGrades([...grades, response.data]);
      setCourse("");
      setName("");
      setGrade("");
      setWeight("");
    } catch (error) {
      alert("Error adding grade: " + (error.response?.data?.message || error.message));
    }
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

  const chartData = {
    labels: grades.map((g) => g.evalName),
    datasets: [
      {
        label: "Cumulative Grade (%)",
        data: grades.map((_, i) => calculateWeightedGrade(grades.slice(0, i + 1)).toFixed(2)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="grade-tracker">
        <UserButton />
      <h2>JustPass</h2>
      <div className="input-row">
        <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Assessment" />
        <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade %" type="number" />
        <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight %" type="number" />
        <button onClick={handleAdd}>Add</button>
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
          <h3>Your Grades:</h3>
          {grades.map((g, index) => (
            <div key={index} className="grade-item">
              <span>{g.course} - {g.evalName}: {g.grade}% (Weight: {g.weight}%)</span>
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

    
  );
}

export default ProtectedPage;
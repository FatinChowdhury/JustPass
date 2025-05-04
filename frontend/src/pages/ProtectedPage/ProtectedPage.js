import React, { useState } from "react";
import { Protect, UserButton } from "@clerk/clerk-react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ProtectedPage = () => {
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [remainingWeight, setRemainingWeight] = useState("");
  const [requiredGrade, setRequiredGrade] = useState(null);

  const handleAdd = () => {
    if (!name || isNaN(grade) || isNaN(weight)) return;
    const newWeight = parseFloat(weight);
    const currentWeight = grades.reduce((acc, g) => acc + g.weight, 0);

    if (currentWeight + newWeight > 100) {
        alert("Total weight cannot exceed 100%");
        return;
    }

    setGrades([...grades, { name, grade: parseFloat(grade), weight: newWeight }]);
    setName("");
    setGrade("");
    setWeight("");
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
    labels: grades.map((g) => g.name),
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
      </div>

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
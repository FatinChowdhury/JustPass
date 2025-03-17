import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
    const [grades, setGrades] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        axios.get('/api/grades')
            .then((res) => {
                setGrades(res.data);
                updateChartData(res.data);
            });
    }, []);


    const updateChartData = (grades) => {
        const labels = grades.map((grade) => grade.subject);
        const data = grades.map((grade) => grade.grade);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Grades Progress',
                    data,
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
            ],
        });
    };

    return (
        <div>
            <h1>Your Grades</h1>
            <Line data={chartData} />
            <h2>Grade List</h2>
            <ul>
                {grades.map((grade) => (
                    <li key={grade._id}>
                        <p>{grade.subject} - {grade.grade}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
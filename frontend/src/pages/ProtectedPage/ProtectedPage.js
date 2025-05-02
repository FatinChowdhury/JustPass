import React from "react";
import { Protect, UserButton } from "@clerk/clerk-react";
import "./protectedpage.css"; // Make sure to import your CSS file

const ProtectedPage = () => {
    const courses = [
        { name: "Mathematics", grade: 85 },
        { name: "Physics", grade: 78 },
        { name: "Computer Science", grade: 92 },
        { name: "Statistics", grade: 88 },
    ];

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Dashboard</h1>
                <UserButton />
            </div>

            <div className="cards-container">
                {courses.map((course, index) => (
                    <div key={index} className="card">
                        <h2>{course.name}</h2>
                        <p>Grade: {course.grade}%</p>
                        <progress value={course.grade} max="100"></progress>
                    </div>
                ))}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Grade (%)</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index}>
                            <td>{course.name}</td>
                            <td>{course.grade}</td>
                            <td>
                                <progress value={course.grade} max="100"></progress>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
};

export default ProtectedPage;

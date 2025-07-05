import "../style/Courses.css";
import React, { useEffect, useState } from "react";

function Courses() {
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);

    const handleBookmark = (course) => {
        setBookmarkedCourses((prev) => {
            const isBookmarked = prev.some((c) => c.id === course.id);
            if (isBookmarked) {
                return prev.filter((c) => c.id !== course.id);
            } else {
                return [...prev, course];
            }
        });
    };

    useEffect(() => {
        const stored = localStorage.getItem("bookmarkedCourses");
        if (stored) {
            setBookmarkedCourses(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("bookmarkedCourses", JSON.stringify(bookmarkedCourses));
    }, [bookmarkedCourses]);

    const coursesData = [
        {
            id: 1,
            type: "licenciatura",
            title: "Design de moda",
            institution: "faculdade de arquitetura da universidade de Lisboa, FAUL",
            colorClass: "red"
        },
        {
            id: 2,
            type: "pós-graduação",
            title: "design de produto",
            institution: "universidade IADE",
            colorClass: "purple"
        },
        {
            id: 3,
            type: "mestrado",
            title: "ux/ui design",
            institution: "Atlântica - instituto universitário",
            colorClass: "orange"
        },
        {
            id: 4,
            type: "CTeSP",
            title: "design de interiores",
            institution: "escola Superior de Viseu",
            colorClass: "green"
        },
        {
            id: 5,
            type: "curso de especialização",
            title: "design gráfico",
            institution: "escola de tecnologias inovação e criação, ETIC",
            colorClass: "yellow"
        },
        {
            id: 6,
            type: "upskill",
            title: "design multimédia",
            institution: "universidade da Beira Interior",
            colorClass: "blue"
        }
    ];

    return (
        <>
            <div className="filters">
                <div className="filters-box">
                    <select><option>curso</option><option>design</option><option>bioquimica</option></select>
                    <select><option>instituição</option><option>ISCTE</option><option>FBAUL</option></select>
                    <select><option>área</option><option>artes</option><option>ciências</option></select>
                    <select><option>distrito</option><option>Lisboa</option><option>Beja</option></select>
                    <select><option>data</option><option>2025</option><option>2026</option></select>
                </div>
            </div>

            <div className="courses-container">
                {coursesData.map((course) => (
                    <div key={course.id} className={`course-card ${course.colorClass}`}>
                        <h3 className="course-header">
                            <span className="course-type">{course.type}</span>
                            <span
                                className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === course.id) ? "active" : ""}`}
                                onClick={() => handleBookmark(course)}
                                aria-hidden="true"
                            ></span>
                        </h3>
                        <h5>{course.title}</h5>
                        <p>{course.institution}</p>
                    </div>
                ))}
            </div>
            <footer className="footer-courses">
                <div className="footer-courses-content">
                    <a href="https://github.com/buddie-project"
                       target="_blank"
                       rel="noreferrer"
                       className="github-link">
                        <img src="/images/github-mark.svg" className="github-icon" width="32" height="auto" alt="Github Logo" />
                    </a>

                    <p> | &copy; {new Date().getFullYear()} Buddie. All rights reserved. </p>

                </div>

            </footer>
        </>
    );
}

export default Courses;
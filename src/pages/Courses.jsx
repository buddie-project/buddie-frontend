import "../style/Courses.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/generalComponents/Pagination.jsx";
import {Link} from "react-router-dom";

function Courses() {
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [institutionData, setInstitutionData] = useState([]);
    const [filters, setFilters] = useState({
        curso: "",
        instituicao: "",
        area: "",
        distrito: "",
        data: ""
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [coursesPerPage] = useState(9);
    const totalPages = Math.ceil(coursesData.length / coursesPerPage);

    const getPaginatedCourses = () => {
        const start = (currentPage - 1) * coursesPerPage;
        const end = start + coursesPerPage;
        return coursesData.slice(start, end);
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/courses")
            .then((res) => {
                const coursesWithColors = assignColors(res.data);
                setCoursesData(coursesWithColors);
            })
            .catch((err) => console.error("Erro ao procurar cursos:", err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/api/institution")
            .then((res) => setInstitutionData(res.data))
            .catch((err) => console.error("Erro ao procurar instituições:", err));
    }, []);

    const handleBookmark = (course) => {
        setBookmarkedCourses((prev) => {
            const isBookmarked = prev.some((c) => c.codigoCurso === course.codigoCurso);
            return isBookmarked
                ? prev.filter((c) => c.codigoCurso !== course.codigoCurso)
                : [...prev, course];
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

    const colors = ["red", "blue", "green", "orange", "purple", "yellow"];

    const assignColors = (courses) => {
        let lastColor = "";
        return courses.map((course) => {
            let availableColors = colors.filter(c => c !== lastColor);
            let color = availableColors[Math.floor(Math.random() * availableColors.length)];
            lastColor = color;
            return { ...course, color };
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    return (
        <>
            <div className="filters">
                <div className="filters-box">
                    <select onChange={(e) => setFilters({ ...filters, curso: e.target.value })}>
                        <option value="">curso</option>
                        <option value="design">design</option>
                        <option value="bioquimica">bioquimica</option>
                    </select>
                    <select onChange={(e) => setFilters({ ...filters, instituicao: e.target.value })}>
                        <option value="">instituição</option>
                        <option value="ISCTE">ISCTE</option>
                        <option value="FBAUL">FBAUL</option>
                    </select>
                    <select onChange={(e) => setFilters({ ...filters, area: e.target.value })}>
                        <option value="">área</option>
                        <option value="artes">artes</option>
                        <option value="ciencias">ciências</option>
                    </select>
                    <select onChange={(e) => setFilters({ ...filters, distrito: e.target.value })}>
                        <option value="">distrito</option>
                        <option value="Lisboa">Lisboa</option>
                        <option value="Beja">Beja</option>
                    </select>
                    <select onChange={(e) => setFilters({ ...filters, data: e.target.value })}>
                        <option value="">data</option>
                        <option value="2024">2024</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
            </div>

            <div className="applied-filters">
                <p>Filtros ativos:</p>
                {Object.entries(filters).map(
                    ([key, value]) =>
                        value && (
                            <span key={key} className="filter-tag">
                                {key}: {value}
                            </span>
                        )
                )}
            </div>

            <div className="courses-container">
                {getPaginatedCourses().map((course) => {
                    const matchedInstitution = institutionData.find(
                        (inst) => inst.id === course.instituicaoId
                    );

                    return (
                        <Link to={`/courses/${course.codigoCurso}`} key={course.codigoCurso} className={`course-card ${course.color}`}>
                            <h3 className="course-header">
                                <span className="course-name">{course.nome}</span>
                                <span
                                    className={`icon-bookmark ${
                                        bookmarkedCourses.some(
                                            (c) => c.codigoCurso === course.codigoCurso
                                        )
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBookmark(course);
                                    }}
                                    aria-hidden="true"
                                ></span>
                            </h3>
                            <section className="course-info">
                                <h5>{course.nomeAreaEstudo}</h5>
                                <p>
                                    {matchedInstitution?.nomeIes ? (
                                        <Link to={`/institutions/${matchedInstitution.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                                            {matchedInstitution.nomeIes}
                                        </Link>
                                    ) : (
                                        "Desconhecida"
                                    )}
                                </p>
                            </section>
                        </Link>
                    );
                })}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <footer className="footer-courses">
                <div className="footer-courses-content">
                    <a
                        href="https://github.com/buddie-project"
                        target="_blank"
                        rel="noreferrer"
                        className="github-link"
                    >
                        <img
                            src="/images/github-mark.svg"
                            className="github-icon"
                            width="32"
                            height="auto"
                            alt="Github Logo"
                        />
                    </a>
                    <p> | &copy; {new Date().getFullYear()} Buddie. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Courses;

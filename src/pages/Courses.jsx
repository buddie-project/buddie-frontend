import "../style/Courses.css";
import React, { useEffect, useState } from "react";
import Pagination from "../components/generalComponents/Pagination.jsx";
import {Link} from "react-router-dom";
import api from "../services/api.js";

function Courses() {
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [filters, setFilters] = useState({
        curso: "",
        instituicao: "",
        area: "",
        distrito: "",
        estado: "",
    });

    const [courseNames, setCourseNames] = useState([]);
    const [institutionNames, setInstitutionNames] = useState([]);
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [status, setStatus] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        let params = {
            page: currentPage - 1,
            numResults: 9,
            ...filters
        };

        api.get("/api/courses", {
            params
        })
            .then((res) => {
                const coursesWithColors = assignColors(res.data.courses);
                setCoursesData(coursesWithColors);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => console.error("Erro ao procurar cursos:", err));
    }, [currentPage, filters]);


    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Buscar nomes de cursos distintos
                const coursesNamesRes = await api.get("/api/courses/distinct-names");
                setCourseNames(coursesNamesRes.data);

                // Buscar nomes de instituições distintos
                const institutionNamesRes = await api.get("/api/institution/distinct-names");
                setInstitutionNames(institutionNamesRes.data);

                // Buscar áreas de estudo distintas
                const areasRes = await api.get("/api/courses/distinct-areas");
                setAreas(areasRes.data);

                // Buscar distritos distintos
                const districtsRes = await api.get("/api/institution/distinct-districts");
                setDistricts(districtsRes.data);

                // Buscar estados de curso DGES distintos
                const statusesRes = await api.get("/api/courses/distinct-statuses");
                setStatus(statusesRes.data);

            } catch (err) {
                console.error("Erro ao carregar opções de filtro:", err);
            }
        };
        fetchFilterOptions();
    }, []);

        const handleBookmark = (course) => {
            setBookmarkedCourses((prev) => {
                const isBookmarked = prev.some((c) => c.courseId === course.courseId);
                return isBookmarked
                    ? prev.filter((c) => c.courseId !== course.courseId)
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
                return {...course, color};
            });
        };

        useEffect(() => {
            setCurrentPage(1);
        }, [filters]);

        const handleFilterChange = (filterName, value) => {
            setFilters(prevFilters => ({
                ...prevFilters,
                [filterName]: value
            }));
        };

        return (
            <>
                <div className="filters">
                    <div className="filters-box">
                        <select className="option" onChange={(e) => handleFilterChange("curso", e.target.value)} value={filters.curso}>
                            <option value="">curso</option>
                            {courseNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <select className="option" onChange={(e) => handleFilterChange("instituicao", e.target.value)} value={filters.instituicao}>
                            <option value=" ">instituição</option>
                            {institutionNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <select className="option" onChange={e => handleFilterChange("area", e.target.value)} value={filters.area}>
                                <option value="">area</option>
                            {areas.map(area => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                        <select className="option" onChange={e => handleFilterChange("distrito", e.target.value)} value={filters.distrito}>
                                <option value=" ">distrito</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        <select className="option" onChange={(e) => handleFilterChange("estado", e.target.value)} value={filters.estado}>
                            <option value=" ">estado</option>
                            {status.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
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
                    {coursesData.map((course) => {
                        return (
                            <Link to={`/courses/${course.courseId}`} key={course.courseId}
                                  className={`course-card ${course.color}`}>
                                <h3 className="course-header">
                                    <span className="course-name">{course.courseName}</span>
                                    <span
                                        className={`icon-bookmark ${
                                            bookmarkedCourses.some(
                                                (c) => c.courseId === course.courseId
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
                                    <h5>{course.fieldOfStudy}</h5>
                                    <p>
                                        {course.institutionName ? (
                                            <Link to={`/institutions/${course.institutionId}`}
                                                  style={{textDecorationColor: 'white'}}>
                                                {course.institutionName}
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

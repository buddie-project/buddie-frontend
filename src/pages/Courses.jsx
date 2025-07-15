import "../style/Courses.css";
import "../style/App.css"
import React, {useEffect, useState} from "react";
import Pagination from "../components/generalComponents/Pagination.jsx";
import {Link, useLocation} from "react-router-dom";
import api from "../services/api.js";
import AutocompleteDropdown from "./../components/generalComponents/AutocompleteDropdown.jsx";
import {useUserContext} from "../services/UserContext.jsx";
import seedrandom from "seedrandom";

function Courses() {
    const [savedCourseIds, setSavedCourseIds] = useState(new Set());
    const [coursesData, setCoursesData] = useState([]);

    const filtersFromQuery = new URLSearchParams(window.location.search);
    const initialFilters = {
        curso: filtersFromQuery.get("curso") || "",
        instituicao: filtersFromQuery.get("instituicao") || "",
        area: filtersFromQuery.get("area") || "",
        distrito: filtersFromQuery.get("distrito") || "",
        status: filtersFromQuery.get("status") || "",
    }

    const [filters, setFilters] = useState(initialFilters);

    const [courseNames, setCourseNames] = useState([]);
    const [institutionNames, setInstitutionNames] = useState([]);
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [status, setStatus] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();

    const {user} = useUserContext();
    const userId = user?.id;

    useEffect(() => {
        // Extrair o filtro da URL
        const queryParams = new URLSearchParams(location.search);
        const filtro = queryParams.get('filtro');
        if (filtro) {
            setFilters(prevFilters => ({
                ...prevFilters,
                area: filtro
            }));
        }
    }, [location]);

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

                const coursesNamesRes = await api.get("/api/courses/distinct-names");
                setCourseNames(coursesNamesRes.data);

                const institutionNamesRes = await api.get("/api/institution/distinct-names");
                setInstitutionNames(institutionNamesRes.data);


                const areasRes = await api.get("/api/courses/distinct-areas");
                setAreas(areasRes.data);


                const districtsRes = await api.get("/api/institution/distinct-districts");
                setDistricts(districtsRes.data);


                const statusesRes = await api.get("/api/courses/distinct-statuses");
                setStatus(statusesRes.data);

            } catch (err) {
                console.error("Erro ao carregar opções de filtro:", err);
            }
        };
        fetchFilterOptions();
    }, []);

    const handleSaveCourse = async (course) => {
        if (!userId) {
            alert("Você precisa estar logado para salvar cursos.");
            return;
        }

        const isSaved = savedCourseIds.has(course.courseId);

        try {
            if (isSaved) {
                await api.post(`/api/courses/${course.courseId}/saved/delete`);
                setSavedCourseIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(course.courseId);
                    return newSet;
                });
            } else {
                await api.post(`/api/courses/${course.courseId}/saved`);
                setSavedCourseIds((prev) => new Set(prev).add(course.courseId));
            }
        } catch (error) {
            console.error("Erro ao atualizar cursos guardados:", error);
            alert("Erro ao atualizar cursos guardados. Tente novamente.");
        }
    };

    useEffect(() => {
        const fetchSavedCourses = async () => {
            if (!userId) {
                setSavedCourseIds(new Set());
                return;
            }
            try {
                const res = await api.get(`/api/user/saved`);
                const savedIds = new Set(res.data.map(savedCourse => savedCourse.courseId));
                setSavedCourseIds(savedIds);
            } catch (err) {
                console.error("Erro ao buscar cursos guardados:", err);
                setSavedCourseIds(new Set());
            }
        };

        fetchSavedCourses();
    }, [userId]);


    const colors = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

    const assignColors = (courses) => {
        return courses.map((course) => {
            const rng = seedrandom(course.courseId?.toString() || course.courseName);
            const colorIndex = Math.floor(rng() * colors.length);
            const color = colors[colorIndex];
            return {...course, color};
        });
    };

    useEffect(() => {
        setCurrentPage(1);
        //modify query search
        const queryParams = new URLSearchParams(location.search);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.set(key, value);
            } else {
                queryParams.delete(key);
            }
        });
        // Update the URL with the new filters
        window.history.replaceState({}, "", `?${queryParams.toString()}`);
    }, [filters]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    const handleRemoveFilter = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: ""
        }));
    };

    return (
        <>
            <div className="filters">
                <div className="filters-box">
                    <AutocompleteDropdown
                        label="curso"
                        options={courseNames}
                        value={filters.curso}
                        onValueChange={(value) => handleFilterChange("curso", value)}
                        className="option"
                    />
                    <AutocompleteDropdown
                        label="instituição"
                        options={institutionNames}
                        value={filters.instituicao}
                        onValueChange={(value) => handleFilterChange("instituição", value)}
                        className="option"
                    />
                    <AutocompleteDropdown
                        label="área"
                        options={areas}
                        value={filters.area}
                        onValueChange={(value) => handleFilterChange("área", value)}
                        className="option"
                    />
                    <AutocompleteDropdown
                        label="distrito"
                        options={districts}
                        value={filters.distrito}
                        onValueChange={(value) => handleFilterChange("distrito", value)}
                        className="option"
                    />
                    <AutocompleteDropdown
                        label="status"
                        options={status}
                        value={filters.status}
                        onValueChange={(value) => handleFilterChange("status", value)}
                        className="option"
                    />
                </div>
            </div>

            <div className="applied-filters">
                <p>Filtros ativos:</p>
                {Object.entries(filters).map(
                    ([key, value]) =>
                        value && (
                            <span key={key} className="filter-tag">
                                {key}: {value}
                                <span className="filter-tag-remove" onClick={() => handleRemoveFilter(key)}>
                                    &times;
                                </span>
                            </span>
                        )
                )}
            </div>

            <div className="courses-container">
                {coursesData.map((course) => {
                    const isBookmarked = savedCourseIds.has(course.courseId);

                    return (
                        <Link to={`/cursos/${course.courseId}`} key={course.courseId}
                              className={`course-card ${course.color}`}>
                            <h3 className="course-header">
                                <span className="course-name">{course.courseName}</span>

                                <span
                                    className={isBookmarked ? "icon-bookmark-filled" : "icon-bookmark"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSaveCourse(course);
                                    }}
                                    aria-hidden="true"
                                ></span>
                            </h3>
                            <section className="course-info">
                                <h5>{course.fieldOfStudy}</h5>
                                <p>
                                    {course.institutionName ? (
                                        <Link to={`/instituicao/${course.institutionId}`}
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
        </>
    );
}

export default Courses;


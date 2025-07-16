import "../style/Courses.css";
import "../style/App.css";
import React, {useEffect, useState} from "react";
import Pagination from "../components/generalComponents/Pagination.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import api from "../services/api.js";
import AutocompleteDropdown from "./../components/generalComponents/AutocompleteDropdown.jsx";
import {useUserContext} from "../services/UserContext.jsx";
import {toast} from 'react-toastify';
import seedrandom from "seedrandom";

// CORREÇÃO: Mover 'colors' e 'assignColors' para fora do componente.
// Elas são estáticas e não precisam ser recriadas em cada renderização.
const COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

// Esta função não precisa ser um useCallback se COLORS for uma constante global
const assignColorsToCourses = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName);
        const colorIndex = Math.floor(rng() * COLORS.length);
        const color = COLORS[colorIndex];
        return {...course, color};
    });
};


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
    };

    const [filters, setFilters] = useState(initialFilters);

    const [courseNames, setCourseNames] = useState([]);
    const [institutionNames, setInstitutionNames] = useState([]);
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [status, setStatus] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const {user, loading: userContextLoading} = useUserContext();
    const userId = user?.id;

    const [isLoading, setIsLoading] = useState(true);

    // REMOVIDO: A declaração de 'colors' movida para fora do componente.
    // REMOVIDO: assignColors movida para fora do componente e renomeada.


    // Efeito para extrair filtro da URL na montagem inicial ou mudança de URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const filtro = queryParams.get('filtro');
        if (filtro) {
            setFilters(prevFilters => ({
                ...prevFilters,
                area: filtro
            }));
        }
        const pageParam = queryParams.get('page');
        if (pageParam) {
            setCurrentPage(parseInt(pageParam));
        }
    }, [location.search]);


    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            const params = {
                page: currentPage - 1,
                numResults: 9,
                ...filters
            };

            try {
                const res = await api.get("/api/courses", {params});
                // CORREÇÃO: Chamar a função global assignColorsToCourses.
                const coursesWithColors = assignColorsToCourses(res.data.courses);
                setCoursesData(coursesWithColors);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Erro ao procurar cursos:", err);
                toast.error("Erro ao carregar cursos. Tente novamente.", {theme: "colored"});
            } finally {
                setIsLoading(false);
            }
        };

        // CORREÇÃO: Remover 'assignColors' das dependências do useEffect,
        // pois ela agora é uma função estática global e não muda.
        fetchCourses();
    }, [currentPage, filters]); // Dependências: currentPage, filters.

    // Efeito para buscar opções de filtro na montagem
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
                toast.error("Erro ao carregar opções de filtro. Algumas opções podem estar indisponíveis.", {theme: "colored"});
            }
        };
        fetchFilterOptions();
    }, []);

    const handleSaveCourse = async (course) => {
        if (!userId) {
            toast.info("Você precisa estar logado para salvar cursos.", {theme: "colored"});
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
                toast.success("Curso removido da lista 'Ver mais tarde'!", {theme: "colored"});
            } else {
                await api.post(`/api/courses/${course.courseId}/saved`);
                setSavedCourseIds((prev) => new Set(prev).add(course.courseId));
                toast.success("Curso adicionado à lista 'Ver mais tarde'!", {theme: "colored"});
            }
        } catch (error) {
            console.error("Erro ao atualizar cursos guardados:", error);
            const errorMessage = error.response?.data?.message || "Erro ao atualizar cursos guardados. Tente novamente.";
            toast.error(errorMessage, {theme: "colored"});
        }
    };

    useEffect(() => {
        const fetchSavedCourses = async () => {
            if (userContextLoading) {
                return;
            }

            if (!user || !user.id) {
                setSavedCourseIds(new Set());
                return;
            }
            try {
                // Requisição ao backend para obter os cursos salvos
                const res = await api.get(`/api/user/saved`);
                // CORREÇÃO: Mapeamento defensivo para SavedCourseResponseDTO
                const savedCourseData = res.data
                    .filter(savedCourseDto => savedCourseDto.course != null) // Filtra objetos onde 'course' é nulo
                    .map(savedCourseDto => savedCourseDto.course?.courseId); // Apenas o ID do curso é necessário para o Set

                setSavedCourseIds(new Set(savedCourseData));
            } catch (err) {
                console.error("Erro ao buscar cursos guardados:", err);
                setSavedCourseIds(new Set());
                toast.error("Não foi possível carregar cursos guardados.", {theme: "colored"});
            }
        };

        fetchSavedCourses();
    }, [user, userContextLoading]);


    useEffect(() => {
        setCurrentPage(1);
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.set(key, value);
            } else {
                queryParams.delete(key);
            }
        });
        queryParams.set('page', '1');
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

    // Função para a paginação
    const handlePageChange = (page) => {
        setCurrentPage(page);
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set('page', page.toString());
        window.history.replaceState({}, "", `?${queryParams.toString()}`);
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
                        onValueChange={(value) => handleFilterChange("instituicao", value)}
                        className="option"
                    />
                    <AutocompleteDropdown
                        label="área"
                        options={areas}
                        value={filters.area}
                        onValueChange={(value) => handleFilterChange("area", value)}
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
                {isLoading ? (
                    <p className="loading-text">A carregar cursos...</p>
                ) : coursesData.length === 0 ? (
                    <p className="empty-text">Nenhum curso encontrado com os filtros aplicados.</p>
                ) : (
                    coursesData.map((course) => {
                        const isBookmarked = savedCourseIds.has(course.courseId);

                        return (
                            <Link to={`/cursos/${course.courseId}`} key={course.courseId}
                                  className={`course-card ${course.color}`}>
                                <h3 className="course-header">
                                    <span className="course-name">{course.courseName}</span>

                                    <span
                                        className={isBookmarked ? "icon-bookmark-filled" : "icon-bookmark"}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveCourse(course); }}
                                        aria-hidden="true"
                                    ></span>
                                </h3>
                                <section className="course-info">
                                    <h5>{course.fieldOfStudy}</h5>
                                    <p
                                        className="institution-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/instituicao/${course.institutionId}`);
                                        }}
                                    >
                                        {course.institutionName}
                                    </p>
                                </section>
                            </Link>
                        );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
}

export default Courses;
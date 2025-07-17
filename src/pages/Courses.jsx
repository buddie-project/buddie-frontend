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

/**
 * Cores predefinidas para os cartões de curso, usadas para atribuição aleatória.
 * @type {string[]}
 */
const COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

/**
 * Atribui uma cor aleatória a cada curso numa lista, garantindo que a cor anterior não é repetida.
 * A seleção de cor é determinística baseada no courseId ou courseName para consistência visual.
 * @param {object[]} courses - A lista de objetos de curso.
 * @returns {object[]} A lista de cursos com a propriedade 'color' adicionada.
 */
const assignColorsToCourses = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName);
        const colorIndex = Math.floor(rng() * COLORS.length);
        const color = COLORS[colorIndex];
        return {...course, color};
    });
};

/**
 * Componente Courses.
 * Exibe uma lista paginada e filtrável de cursos. Permite aos utilizadores pesquisar,
 * filtrar cursos por várias categorias e guardar/remover cursos dos favoritos.
 * @returns {JSX.Element} O componente Courses.
 */
function Courses() {
    /**
     * Estado para armazenar os IDs dos cursos guardados pelo utilizador.
     * @type {Set<string|number>}
     */
    const [savedCourseIds, setSavedCourseIds] = useState(new Set());
    /**
     * Estado para armazenar os dados dos cursos a serem exibidos.
     * Inclui a cor atribuída para o cartão.
     * @type {object[]}
     */
    const [coursesData, setCoursesData] = useState([]);

    /**
     * Extrai os filtros iniciais da URL da página.
     * @type {URLSearchParams}
     */
    const filtersFromQuery = new URLSearchParams(window.location.search);
    /**
     * Objeto de filtros iniciais, com base nos parâmetros da URL.
     * @type {object}
     */
    const initialFilters = {
        curso: filtersFromQuery.get("curso") || "",
        instituicao: filtersFromQuery.get("instituicao") || "",
        area: filtersFromQuery.get("area") || "",
        distrito: filtersFromQuery.get("distrito") || "",
        status: filtersFromQuery.get("status") || "",
    };

    /**
     * Estado para armazenar os filtros atualmente aplicados.
     * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
     */
    const [filters, setFilters] = useState(initialFilters);

    /**
     * Estado para armazenar a lista de nomes de cursos distintos para o AutocompleteDropdown.
     * @type {string[]}
     */
    const [courseNames, setCourseNames] = useState([]);
    /**
     * Estado para armazenar a lista de nomes de instituições distintas para o AutocompleteDropdown.
     * @type {string[]}
     */
    const [institutionNames, setInstitutionNames] = useState([]);
    /**
     * Estado para armazenar a lista de áreas de estudo distintas para o AutocompleteDropdown.
     * @type {string[]}
     */
    const [areas, setAreas] = useState([]);
    /**
     * Estado para armazenar a lista de distritos distintos para o AutocompleteDropdown.
     * @type {string[]}
     */
    const [districts, setDistricts] = useState([]);
    /**
     * Estado para armazenar a lista de opções de status de cursos distintos para o AutocompleteDropdown.
     * @type {string[]}
     */
    const [status, setStatus] = useState([]);

    /**
     * Estado para a página atual da paginação.
     * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
     */
    const [currentPage, setCurrentPage] = useState(1);
    /**
     * Estado para o número total de páginas da paginação.
     * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
     */
    const [totalPages, setTotalPages] = useState(0);
    /**
     * Hook para obter o objeto de localização atual, usado para extrair query params.
     * @type {import('react-router-dom').Location}
     */
    const location = useLocation();
    /**
     * Hook para navegação programática.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * Hook para aceder ao contexto do utilizador, contendo informações do utilizador logado e o estado de carregamento.
     * @type {{user: object|null, loading: boolean}}
     */
    const {user, loading: userContextLoading} = useUserContext();
    /**
     * O ID do utilizador logado, ou null se não estiver autenticado.
     * @type {string|number|null}
     */
    const userId = user?.id;

    /**
     * Estado para indicar se os cursos estão a ser carregados.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Efeito para extrair o filtro 'area' da URL quando o componente monta ou a URL muda.
     * Também ajusta a página atual se um parâmetro 'page' estiver na URL.
     */
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


    /**
     * Efeito para buscar cursos com base na página atual e nos filtros aplicados.
     * É executado sempre que `currentPage` ou `filters` mudam.
     */
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

        fetchCourses();
    }, [currentPage, filters]);

    /**
     * Efeito para buscar as opções de filtro para os AutocompleteDropdowns (nomes de cursos, instituições, áreas, distritos, status).
     * É executado uma vez no carregamento inicial do componente.
     */
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

    /**
     * Lida com a ação de guardar/remover um curso da lista "Ver mais tarde".
     * Requer que o utilizador esteja autenticado.
     * @param {object} course - O objeto do curso a ser guardado/removido.
     */
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

    /**
     * Efeito para buscar os cursos guardados pelo utilizador logado.
     * É executado quando o objeto `user` ou o estado `userContextLoading` mudam.
     */
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
                const res = await api.get(`/api/user/saved`);
                const savedCourseData = res.data
                    .filter(savedCourseDto => savedCourseDto.course != null)
                    .map(savedCourseDto => savedCourseDto.course?.courseId);

                setSavedCourseIds(new Set(savedCourseData));
            } catch (err) {
                console.error("Erro ao buscar cursos guardados:", err);
                setSavedCourseIds(new Set());
                toast.error("Não foi possível carregar cursos guardados.", {theme: "colored"});
            }
        };

        fetchSavedCourses();
    }, [user, userContextLoading]);


    /**
     * Efeito para atualizar os parâmetros de query na URL sempre que os filtros mudam.
     * Redefine a página atual para 1 para novas pesquisas com filtros.
     */
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

    /**
     * Lida com a alteração de um valor de filtro.
     * Atualiza o estado `filters` com o novo valor.
     * @param {string} filterName - O nome do filtro a ser alterado (ex: "curso", "instituicao", "area").
     * @param {string} value - O novo valor para o filtro.
     */
    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    /**
     * Lida com a remoção de um filtro aplicado, limpando o seu valor.
     * @param {string} filterName - O nome do filtro a ser removido.
     */
    const handleRemoveFilter = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: ""
        }));
    };

    /**
     * Lida com a mudança de página na paginação.
     * Atualiza a `currentPage` e o parâmetro 'page' na URL.
     * @param {number} page - O número da nova página.
     */
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
import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Bookmarks.css';
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";
import api from "../../services/api.js";
import { useUserContext } from "../../services/UserContext.jsx";
import { toast } from 'react-toastify';
import seedrandom from "seedrandom";

/**
 * Cores predefinidas para os cartões de cursos guardados, usadas para atribuição aleatória.
 * @type {string[]}
 */
const BOOKMARKS_COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

/**
 * Atribui uma cor aleatória a cada curso guardado numa lista.
 * A seleção de cor é determinística baseada no courseId ou courseName para consistência visual.
 * @param {object[]} courses - A lista de objetos de curso.
 * @returns {object[]} A lista de cursos com a propriedade 'color' adicionada.
 */
const assignColorsToBookmarks = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName || Date.now());
        const colorIndex = Math.floor(rng() * BOOKMARKS_COLORS.length);
        const color = BOOKMARKS_COLORS[colorIndex];
        return { ...course, color };
    });
};

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {boolean} loading - Indica se o contexto do utilizador está a carregar.
 */

/**
 * Componente Bookmarks.
 * Exibe uma lista paginada de cursos que o utilizador guardou para "Ver mais tarde".
 * Permite remover cursos da lista de guardados.
 * @returns {JSX.Element} O componente Bookmarks.
 */
function Bookmarks() {
    /**
     * Estado para o título da página ativa (fixo como 'Ver mais tarde').
     * @type {string}
     */
    const [activePage] = useState('Ver mais tarde');
    /**
     * Estado para armazenar a lista de cursos guardados.
     * @type {object[]}
     */
    const [savedCourses, setSavedCourses] = useState([]);
    /**
     * Estado para a página atual da paginação.
     * @type {number}
     */
    const [currentPage, setCurrentPage] = useState(1);
    /**
     * Estado para indicar se os cursos estão a ser carregados.
     * @type {boolean}
     */
    const [isLoading, setIsLoading] = useState(true);
    /**
     * Estado para armazenar mensagens de erro caso a carga dos cursos falhe.
     * @type {string|null}
     */
    const [error, setError] = useState(null);
    /**
     * Número de itens a serem exibidos por página.
     * @type {number}
     */
    const itemsPerPage = 8;

    /**
     * Hook para aceder ao contexto do utilizador.
     * @type {UserContextObject}
     */
    const { user } = useUserContext();

    /**
     * Efeito para buscar os cursos guardados do utilizador.
     * É executado quando o objeto `user` do contexto muda.
     */
    useEffect(() => {
        const fetchSavedCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/user/saved`);

                const coursesToProcess = response.data
                    .filter(savedCourseDto => savedCourseDto.course != null)
                    .map(savedCourseDto => ({
                        id: savedCourseDto.id,
                        courseId: savedCourseDto.course?.courseId,
                        courseName: savedCourseDto.course?.courseName,
                        fieldOfStudy: savedCourseDto.course?.fieldOfStudy,
                        institutionName: savedCourseDto.course?.institutionName,
                        institutionId: savedCourseDto.course?.institutionId
                    }));

                const finalCourses = assignColorsToBookmarks(coursesToProcess);
                setSavedCourses(finalCourses);

            }
            catch (err) {
                console.error("Erro ao buscar cursos guardados:", err);
                setError("Não foi possível carregar os cursos guardados. Por favor, tente novamente.");
                toast.error("Erro ao carregar cursos guardados.", { theme: "colored" });
                setSavedCourses([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchSavedCourses();
    }, [user]);

    /**
     * Lida com a remoção de um curso da lista "Ver mais tarde".
     * Envia um pedido para a API para remover o curso e atualiza o estado localmente.
     * @param {number|string} savedCourseEntryId - O ID da entrada do curso guardado a ser removida.
     */
    const handleRemoveBookmark = async (savedCourseEntryId) => {
        try {
            // BUG CORRIGIDO: O {id} na string do URL agora é substituído pelo valor da variável.
            await api.post(`/api/user/saved/${savedCourseEntryId}/delete`);
            setSavedCourses(prev => prev.filter(sc => sc.id !== savedCourseEntryId));
            toast.success("Curso removido da lista 'Ver mais tarde'!", { theme: "colored" });
        } catch (error) {
            console.error("Erro ao remover curso guardado:", error);
            const errorMessage = error.response?.data?.message || "Erro ao remover o curso guardado.";
            toast.error(errorMessage, { theme: "colored" });
        }
    };

    /**
     * Calcula o número total de páginas com base na quantidade de cursos e itens por página.
     * Memoizado para evitar recálculos desnecessários.
     * @type {number}
     */
    const totalPages = useMemo(() => Math.ceil(savedCourses.length / itemsPerPage), [savedCourses]);

    /**
     * Calcula a sub-lista de cursos a serem exibidos na página atual.
     * Memoizado para evitar recálculos desnecessários.
     * @type {object[]}
     */
    const displayedCourses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return savedCourses.slice(start, start + itemsPerPage);
    }, [savedCourses, currentPage]);

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">{activePage}</h2>
            <div className="card-two">
                <div className="bookmarks-profile-container">
                    {isLoading ? (
                        <p className="loading-text">A carregar...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : displayedCourses.length === 0 ? (
                        <p className="empty-text">Nenhum curso salvo para ver mais tarde.</p>
                    ) : (
                        <div className="courses-container-profile">
                            {displayedCourses.map((course) => (
                                <div key={course.id} className={`course-card-profile ${course.color || "default-color"}`}>
                                    <Link to={`/cursos/${course.courseId}`} className="course-link">
                                        <h3 className="course-name">{course.courseName}</h3>
                                        <p>{course.fieldOfStudy}</p>
                                    </Link>
                                    <span
                                        className="icon-bookmark-filled bookmark-icon-bottom"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveBookmark(course.id); }}
                                        aria-hidden="true"
                                    ></span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="pagination-container">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookmarks;
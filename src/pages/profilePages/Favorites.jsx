import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Favorites.css';
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";
import api from "../../services/api.js";
import seedrandom from "seedrandom";
import { toast } from "react-toastify";
import { useUserContext } from "../../services/UserContext.jsx";

/**
 * Cores predefinidas para os cartões de cursos favoritos, usadas para atribuição aleatória.
 * @type {string[]}
 */
const FAVORITES_COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

/**
 * Atribui uma cor aleatória a cada curso favorito numa lista.
 * A seleção de cor é determinística baseada no `courseId` ou `courseName` para consistência visual.
 * @param {object[]} courses - A lista de objetos de curso.
 * @returns {object[]} A lista de cursos com a propriedade 'color' adicionada.
 */
const assignColorsToFavorites = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName);
        const colorIndex = Math.floor(rng() * FAVORITES_COLORS.length);
        const color = FAVORITES_COLORS[colorIndex];
        return { ...course, color };
    });
};

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {boolean} loading - Indica se o contexto do utilizador está a carregar.
 */

/**
 * Componente Favorites.
 * Exibe uma lista paginada de cursos que o utilizador marcou como favoritos.
 * Permite remover cursos da lista de favoritos.
 * @returns {JSX.Element} O componente Favorites.
 */
function Favorites() {
    /**
     * Estado para o título da página ativa (fixo como 'Favoritos').
     * @type {string}
     */
    const [activePage] = useState('Favoritos');
    /**
     * Estado para armazenar a lista de cursos favoritos.
     * @type {object[]}
     */
    const [favoriteCourses, setFavoriteCourses] = useState([]);
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
     * Efeito para buscar os cursos favoritos do utilizador.
     * É executado quando o objeto `user` do contexto muda.
     */
    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            try {
                if (!user || !user.id) {
                    setIsLoading(false);
                    setFavoriteCourses([]);
                    toast.info("Faça login para ver os seus favoritos.", { theme: "colored" });
                    return;
                }

                const res = await api.get("/api/user/favorites");

                const mappedCourses = res.data
                    .filter(favDto => favDto.course != null)
                    .map(favDto => ({
                        id: favDto.id,
                        courseId: favDto.course?.courseId,
                        courseName: favDto.course?.courseName,
                        fieldOfStudy: favDto.course?.fieldOfStudy,
                        institutionName: favDto.course?.institutionName,
                        institutionId: favDto.course?.institutionId
                    }));

                const finalCourses = assignColorsToFavorites(mappedCourses);
                setFavoriteCourses(finalCourses);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
                toast.error("Erro ao carregar favoritos. Tente novamente.", { theme: "colored" });
                setFavoriteCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    /**
     * Lida com a remoção de um curso da lista de favoritos.
     * Envia um pedido para a API para remover a entrada do favorito e atualiza o estado localmente.
     * @param {number|string} favoriteEntryId - O ID da entrada do curso favorito a ser removida.
     */
    const handleRemoveFavorite = async (favoriteEntryId) => {
        try {
            // BUG CORRIGIDO: O {id} na string do URL agora é substituído pelo valor da variável.
            await api.post(`/api/user/favorites/${favoriteEntryId}/delete`);
            setFavoriteCourses(prev => prev.filter(fc => fc.id !== favoriteEntryId));
            toast.success("Curso removido dos favoritos!", {theme: "colored"});
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            const errorMessage = error.response?.data?.message || "Erro ao remover o curso dos favoritos.";
            toast.error(errorMessage, {theme: "colored"});
        }
    };

    /**
     * Calcula o número total de páginas com base na quantidade de cursos favoritos e itens por página.
     * Memoizado para evitar recálculos desnecessários.
     * @type {number}
     */
    const totalPages = useMemo(() => Math.ceil(favoriteCourses.length / itemsPerPage), [favoriteCourses]);

    /**
     * Calcula a sub-lista de cursos favoritos a serem exibidos na página atual.
     * Memoizado para evitar recálculos desnecessários.
     * @type {object[]}
     */
    const displayedCourses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return favoriteCourses.slice(start, start + itemsPerPage);
    }, [favoriteCourses, currentPage]);

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">{activePage}</h2>
            <div className="card-two">
                <div className="favorites-profile-container">
                    {isLoading ? (
                        <p className="loading-text">A carregar...</p>
                    ) : displayedCourses.length === 0 ? (
                        <p className="empty-text">Nenhum curso salvo como favorito.</p>
                    ) : (
                        <div className="courses-container-profile">
                            {displayedCourses.map((course) => (
                                course.courseId && (
                                    <div key={course.id} className={`course-card-profile ${course.color || "default-color"}`}>
                                        <Link to={`/cursos/${course.courseId}`} className="course-link">
                                            <h3 className="course-name">{course.courseName}</h3>
                                            <p>{course.fieldOfStudy}</p>
                                        </Link>
                                        <span
                                            className="icon-star-filled star-icon-bottom"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFavorite(course.id); }}
                                            aria-hidden="true"
                                        ></span>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}

export default Favorites;
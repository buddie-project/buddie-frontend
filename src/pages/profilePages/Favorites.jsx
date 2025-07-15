import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Favorites.css';
import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";
import api from "../../services/api.js";
import seedrandom from "seedrandom";
import {toast} from "react-toastify";
import {useUserContext} from "../../services/UserContext.jsx";

// CORREÇÃO: Mover 'colors' e 'assignColors' para FORA do componente.
// Elas são estáticas e não precisam ser recriadas em cada renderização, evitando o loop.
const FAVORITES_COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

// Esta função agora é estática e não precisa de useMemo/useCallback no interior do componente.
const assignColorsToFavorites = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName);
        const colorIndex = Math.floor(rng() * FAVORITES_COLORS.length);
        const color = FAVORITES_COLORS[colorIndex];
        return { ...course, color };
    });
};

function Favorites() {

    const [activePage] = useState('Favoritos');
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    const { user } = useUserContext();

    // REMOVIDO: A declaração 'const colors = [...]' que estava aqui.
    // REMOVIDO: A declaração 'const assignColors = useMemo(() => { ... })' que estava aqui.

    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            try {
                // Verificar se o utilizador está logado antes de tentar buscar dados privados
                if (!user || !user.id) {
                    setIsLoading(false);
                    setFavoriteCourses([]); // Limpar favoritos se não houver utilizador
                    toast.info("Faça login para ver os seus favoritos.", { theme: "colored" });
                    return;
                }

                const res = await api.get("/api/user/favorites");

                // CORREÇÃO: Adicionado filtro e optional chaining para mapeamento seguro.
                const mappedCourses = res.data
                    .filter(favDto => favDto.course != null) // Filtra objetos onde 'course' é nulo
                    .map(favDto => ({
                        id: favDto.id, // ID da entidade FavoriteCourse
                        courseId: favDto.course?.courseId, // Acesso seguro com optional chaining
                        courseName: favDto.course?.courseName,
                        fieldOfStudy: favDto.course?.fieldOfStudy,
                        institutionName: favDto.course?.institutionName,
                        institutionId: favDto.course?.institutionId
                    }));

                // CORREÇÃO: Chamar a função global assignColorsToFavorites.
                const finalCourses = assignColorsToFavorites(mappedCourses);
                setFavoriteCourses(finalCourses);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
                toast.error("Erro ao carregar favoritos. Tente novamente.", { theme: "colored" });
                setFavoriteCourses([]); // Limpar em caso de erro na requisição
            } finally {
                setIsLoading(false);
            }
        };

        // CORREÇÃO: As dependências são agora 'user'.
        // A função assignColorsToFavorites é global e não causa loops.
        fetchFavorites();
    }, [user]); // Depende do objeto 'user' (para re-executar quando o estado de login muda)

    // Remover curso favorito
    const handleRemoveFavorite = async (favoriteEntryId) => {
        try {
            await api.post(`/api/user/saved/{id}/delete`);
            setFavoriteCourses(prev => prev.filter(fc => fc.id !== favoriteEntryId));
            toast.success("Curso removido dos favoritos!", {theme: "colored"});
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            const errorMessage = error.response?.data?.message || "Erro ao remover o curso dos favoritos.";
            toast.error(errorMessage, {theme: "colored"});
        }
    };

    const totalPages = useMemo(() => Math.ceil(favoriteCourses.length / itemsPerPage), [favoriteCourses]);

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
                                // Garante que course.courseId existe antes de renderizar
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
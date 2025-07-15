import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Bookmarks.css';
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";
import api from "../../services/api.js";
import { useUserContext } from "../../services/UserContext.jsx";
import { toast } from 'react-toastify';
import seedrandom from "seedrandom";

// CORREÇÃO: Mover 'colors' e 'assignColors' para FORA do componente.
// Elas são estáticas e não precisam ser recriadas em cada renderização, evitando o loop.
const BOOKMARKS_COLORS = ["red", "blue", "green", "orange", "purple", "yellow", "darkblue"];

const assignColorsToBookmarks = (courses) => {
    return courses.map((course) => {
        const rng = seedrandom(course.courseId?.toString() || course.courseName || Date.now());
        const colorIndex = Math.floor(rng() * BOOKMARKS_COLORS.length);
        const color = BOOKMARKS_COLORS[colorIndex];
        return { ...course, color };
    });
};

function Bookmarks() {
    const [activePage] = useState('Ver mais tarde');
    const [savedCourses, setSavedCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;

    const { user } = useUserContext();

    // REMOVIDO: A declaração 'const colors = [...]' que estava aqui.
    // REMOVIDO: A declaração 'const assignColors = useMemo(() => { ... })' que estava aqui.

    useEffect(() => {
        const fetchSavedCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/user/saved`);

                // O mapeamento já estava correto com o filtro e optional chaining.
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

                // CORREÇÃO: Aplicar a função global assignColorsToBookmarks.
                const finalCourses = assignColorsToBookmarks(coursesToProcess);
                setSavedCourses(finalCourses);

            } catch (err) {
                console.error("Erro ao buscar cursos guardados:", err);
                setError("Não foi possível carregar os cursos guardados. Por favor, tente novamente.");
                toast.error("Erro ao carregar cursos guardados.", { theme: "colored" });
                setSavedCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        // CORREÇÃO: Remover 'assignColors' das dependências do useEffect,
        // pois ela agora é uma função estática global e não muda.
        // Adicione 'user' como dependência para que o fetch seja acionado quando o estado de login muda.
        fetchSavedCourses();
    }, [user]); // Dependências: 'user' (assignColorsToBookmarks é global)

    const handleRemoveBookmark = async (savedCourseEntryId) => {
        try {
            await api.post(`/api/user/saved/{id}/delete`);
            setSavedCourses(prev => prev.filter(sc => sc.id !== savedCourseEntryId));
            toast.success("Curso removido da lista 'Ver mais tarde'!", { theme: "colored" });
        } catch (error) {
            console.error("Erro ao remover curso guardado:", error);
            const errorMessage = error.response?.data?.message || "Erro ao remover o curso guardado.";
            toast.error(errorMessage, { theme: "colored" });
        }
    };

    const totalPages = useMemo(() => Math.ceil(savedCourses.length / itemsPerPage), [savedCourses]);

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
                                // Renderizar o card apenas se course.courseId for válido
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

export default Bookmarks;
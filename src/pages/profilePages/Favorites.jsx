import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Favorites.css';
import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";
import api from "../../services/api.js";

function Favorites() {

    const [activePage] = useState('Favoritos');
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await api.get("/api/user/favorites");
                const mapped = res.data.map(fav => ({
                    courseId: fav.course.id,
                    courseName: fav.course.courseName,
                    fieldOfStudy: fav.course.fieldOfStudy,
                    color: fav.course.color || "default-color", // define um valor padrão
                }));
                setFavoriteCourses(mapped);
            } catch (error) {
                console.error("Erro ao buscar favoritos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    // Remover curso
    const handleRemoveFavorite = async (courseId) => {
        try {
            await api.post(`/api/courses/${courseId}/favorites/delete`);
            setFavoriteCourses(prev => prev.filter(c => c.courseId !== courseId));
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            alert("Erro ao remover o curso dos favoritos.");
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
                        <p className="empty-text">Nenhum curso salvo para ver mais tarde.</p>
                    ) : (
                        <div className="courses-container-profile">
                            {displayedCourses.map((course) => (
                                <div key={course.courseId} className={`course-card-profile ${course.color}`}>
                                    <Link to={`/cursos/${course.courseId}`} className="course-link">
                                        <h3 className="course-name">{course.courseName}</h3>
                                        <p>{course.fieldOfStudy}</p>
                                    </Link>
                                    <span
                                        className="icon-star-filled star-icon-bottom"
                                        onClick={() => handleRemoveFavorite(course.courseId)}
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

export default Favorites;

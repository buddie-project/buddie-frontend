import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Favorites.css';
import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";

function Favorites() {

    const [activePage] = useState('Favoritos');
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        const stored = localStorage.getItem("favoriteCourses");
        if (stored) {
            const parsed = JSON.parse(stored);
            setFavoriteCourses(parsed);
        }
        setIsLoading(false);
    }, []);

    // Remover curso
    const handleRemoveFavorite = (courseId) => {
        setFavoriteCourses(prev => prev.filter(c => c.courseId !== courseId));
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

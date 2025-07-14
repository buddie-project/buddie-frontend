import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Bookmarks.css';
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/generalComponents/Pagination.jsx";

function Bookmarks() {
    const [activePage] = useState('Ver mais tarde');
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchSavedCourses = async () => {
            try {
                const response = await fetch("/api/user/saved");
                if (!response.ok) throw new Error("Erro ao buscar cursos guardados.");
                const data = await response.json();
                setBookmarkedCourses(data);
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedCourses();
    }, []);

    // Remover curso
    const handleRemoveBookmark = async (courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/saved/delete`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Erro ao remover curso guardado.");
            }

            // Atualiza o estado após remoção
            setBookmarkedCourses(prev => prev.filter(c => c.courseId !== courseId));
        } catch (error) {
            console.error("Erro:", error);
        }
    };


    const totalPages = useMemo(() => Math.ceil(bookmarkedCourses.length / itemsPerPage), [bookmarkedCourses]);

    const displayedCourses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return bookmarkedCourses.slice(start, start + itemsPerPage);
    }, [bookmarkedCourses, currentPage]);

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">{activePage}</h2>
            <div className="card-two">
                <div className="bookmarks-profile-container">
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
                                        className="icon-bookmark-filled bookmark-icon-bottom"
                                        onClick={() => handleRemoveBookmark(course.courseId)}
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

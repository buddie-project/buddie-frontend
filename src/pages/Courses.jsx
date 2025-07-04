import "../style/Courses.css";
import {useEffect, useState} from "react";

function Courses() {
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);

    const handleBookmark = (courseInfo) => {
        setBookmarkedCourses(prev => {
            const isBookmarked = prev.some(course => course.id === courseInfo.id);

            if (isBookmarked) {
                return prev.filter(course => course.id !== courseInfo.id);
            } else {
                return [...prev, courseInfo];
            }
        });
    };

    useEffect(() => {
        const stored = localStorage.getItem("bookmarkedCourses");
        if (stored) {
            setBookmarkedCourses(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("bookmarkedCourses", JSON.stringify(bookmarkedCourses));
    }, [bookmarkedCourses]);


    return (
        <>
            <div className="filters">
                <div className="filters-box">
                    <select>
                        <option>curso</option>
                        <option>design</option>
                        <option>bioquimica</option>
                    </select>
                    <select>
                        <option>instituição</option>
                        <option>ISCTE</option>
                        <option>FBAUL</option>
                    </select>
                    <select>
                        <option>area</option>
                        <option>artes</option>
                        <option>ciências</option>
                    </select>
                    <select>
                        <option>distrito</option>
                        <option>Lisboa</option>
                        <option>Beja</option>
                    </select>
                    <select>
                        <option>data</option>
                        <option>2025</option>
                        <option>2026</option>
                    </select>
                </div>
            </div>
            <div className="courses-container">
                <div className="course-card red">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 1) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 1,
                           type: "licenciatura",
                           title: "Design de moda",
                           institution: "faculdade de arquitetura da universidade de Lisboa, FAUL"
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>licenciatura</h3>
                    <h5>design de moda</h5>
                    <p>faculdade de arquitetura da universidade de Lisboa, FAUL</p>
                </div>
                <div className="course-card purple">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 2) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 2,
                           type: "pós-graduaçã",
                           title: "design de produto",
                           institution: "universidade IADE"
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>pós-graduação</h3>
                    <h5>design de produto</h5>
                    <p>universidade IADE</p>
                </div>
                <div className="course-card orange">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 3) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 3,
                           type: "mestrado",
                           title: "ux/ui design",
                           institution: "Atlântica - instituto universitário"
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>CESPU</h3>
                    <h5>ux/ui design</h5>
                    <p>Atlântica - instituto universitário</p>
                </div>
                <div className="course-card green">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 4) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 4,
                           type: "CTeSP",
                           title: "design de interiores",
                           institution: "escola Superior de Viseu"
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>CTeSP</h3>
                    <h5>design de interiores</h5>
                    <p>escola Superior de Viseu</p>
                </div>
                <div className="course-card yellow">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 5) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 5,
                           type: "curso de especialização",
                           title: "design gráfico",
                           institution: "escola de tecnologias inovação e criação, ETIC",
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>curso de especialização</h3>
                    <h5>design gráfico</h5>
                    <p>escola de tecnologias
                        inovação e criação, ETIC</p>
                </div>
                <div className="course-card blue">
                    <i className={`icon-bookmark ${bookmarkedCourses.some(c => c.id === 6) ? "active" : ""}`}
                       onClick={() => handleBookmark({
                           id: 6,
                           type: "upskill",
                           title: "design multimédia",
                           institution: "universidade da Beira Interior",
                       })}
                       aria-hidden="true">
                    </i>
                    <h3>upskill</h3>
                    <h5>design multimédia</h5>
                    <p>universidade da Beira Interior</p>
                </div>
            </div>
            <footer className="footer-courses">
                <div className="footer-courses-content">
                    <a href="https://github.com/buddie-project"
                       target="_blank"
                       rel="noreferrer"
                       className="github-link">
                        <img src="/images/github-mark.svg" className="github-icon" width="32" height="auto" alt="Github Logo" />
                    </a>

                    <p> | &copy; {new Date().getFullYear()} Buddie. All rights reserved. </p>

                </div>

            </footer>
        </>
    )
}

export default Courses;
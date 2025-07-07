import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {

        const courseDetails = [
            {
                id: "123",
                nome: "Licenciatura em Psicologia",
                nomeAreaEstudo: "Ciências Sociais",
                anoAcademico: "2025/2026",
                regimeAcesso: "+23",
                requisitos: "Prova escrita e entrevista individual",
                localidade: "Lisboa",
                siteUniversidade: "https://www.universidade-exemplo.pt/curso/psicologia"
            }
        ];

        const foundCourse = courseDetails.find((c) => c.id === id);
        setCourse(foundCourse || null);
    }, [id]);

    if (!course) return <div className="loading">A carregar detalhes...</div>;

    return (
        <>
            <div className="course-detail-container">
            <h1 className="course-title">{course.nome}</h1>
            <h2 className="course-subtitle">{course.nomeAreaEstudo}</h2>

            <div className="course-info-box">
                <div className="left-column">
                    <p><strong>Ano académico:</strong> {course.anoAcademico}</p>
                    <p><strong>Regime de acesso:</strong> {course.regimeAcesso}</p>
                    <p><strong>Requisitos:</strong> {course.requisitos}</p>
                </div>
                <div className="right-column">
                    <p><strong>Localidade:</strong> {course.localidade}</p>
                    <p>
                        <strong>Site da universidade:</strong>{" "}
                        <a href={course.siteUniversidade} target="_blank" rel="noopener noreferrer">
                            {course.siteUniversidade}
                        </a>
                    </p>
                </div>
            </div>
        </div>

           <Comments/>
    </>
    );
}

export default CourseDetails;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [institution, setInstitution] = useState(null);

    useEffect(() => {

        axios.get(`http://localhost:8080/api/courses/${id}`)
            .then((res) => {
                setCourse(res.data);
                if (res.data.instituicaoId) {
                    axios.get(`http://localhost:8080/api/institution/${res.data.instituicaoId}`)
                        .then((instRes) => setInstitution(instRes.data))
                        .catch((err) => console.error("Erro ao buscar detalhes da instituição:", err));
                }
            })
            .catch((err) => {
                console.error("Erro ao buscar detalhes do curso:", err);
                setCourse(null);
            });
    }, [id]);

    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;

    return (
        <>
            <div className="course-detail-container">
                <h1 className="course-title">{course.nome}</h1>
                <h2 className="course-subtitle">{course.nomeAreaEstudo}</h2>

                <div className="course-info-box">
                    <div className="left-column">
                        <p><strong>Instituição:</strong> {institution?.nomeIes || "A carregar..."}</p>
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
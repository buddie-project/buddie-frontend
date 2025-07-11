import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";

function CourseDetails() {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [institution, setInstitution] = useState(null);

    useEffect(() => {

        axios.get(`http://localhost:8080/api/courses/${courseId}`)
            .then((res) => {
                if (res.data.length > 0) {
                    const firstCourse = res.data[0];
                    setCourse(firstCourse);

                    if (firstCourse.courseDTO?.instituicaoId) {
                        axios.get(`http://localhost:8080/api/institution/${firstCourse.courseDTO.instituicaoId}`)
                            .then((instRes) => setInstitution(instRes.data))
                            .catch((err) => console.error("Erro ao encontrar detalhes da instituição:", err));
                    }
                } else {
                    setCourse(null);
                }
            })
    }, [courseId]);

    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;

    return (
        <>
            <div className="course-detail-container">
                <h1 className="course-title">{course.courseDTO?.nome}</h1>
                <h2 className="course-subtitle">{course.courseDTO?.nomeAreaEstudo}</h2>

                {/*//info geral*/}
                <p><strong>Instituição:</strong> {institution?.nomeIes || course.institutionName || "A carregar..."}</p>
                <p><strong>Regime de acesso:</strong> {course.accessRegime}</p>
                <p><strong>Estado do curso:</strong> {course.courseDTO?.estadoCursoDGES}</p>

                <br></br>

                {/*//sobre o curso*/}
                <p><strong>Horário:</strong> {course.shift}</p>
                <p><strong>Ects:</strong> {course.courseDTO?.ects}</p>
                <p><strong>Grau:</strong> {course.courseDTO?.grau}</p>
                <p><strong>Ano académico:</strong> {course.academicYear}</p>
                <p><strong>Vagas:</strong> {course.vacancies}</p>

                <br></br>

                {/*//sobre o concurso*/}
                <p><strong>Requisitos:</strong> {course.rankingCriteria}</p>
                <p><strong>Descrição:</strong> {course.description}</p>





                <p><strong>Localidade:</strong> {course.courseDTO?.localidade}</p>
                <p>
                    <strong>Site da universidade:</strong>{" "}
                    <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
                        {course.sourceUrl}
                    </a>
                </p>
            </div>

            <Comments/>
        </>
    );
}

export default CourseDetails;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";
import api from "../services/api.js";

function CourseDetails() {
    const { id: courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [institution, setInstitution] = useState(null);

    useEffect(() => {

        api.get(`/api/courses/${courseId}`)
            .then((res) => {
                if (res.data.length > 0) {
                    const firstCourse = res.data[0];
                    setCourse(firstCourse);

                    if (firstCourse.courseDTO?.instituicaoId) {
                       api.get(`/api/institution/${firstCourse.courseDTO.instituicaoId}`)
                            .then((instRes) => setInstitution(instRes.data))
                            .catch((err) => console.error("Erro ao encontrar detalhes da instituição:", err));
                    }
                } else {
                    setCourse(null);
                }
            })
    }, [courseId]);

    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;



    const getShiftImage = (shiftValue) => {

        if (shiftValue === "Diurno") {
            return <img src="../../public/icons/day-study.png" alt="Estudo Diurno" className="shift-icon" />;
        }
        if (shiftValue === "Pós-laboral") {
            return <img src="../../public/icons/night-study.png" alt="Estudo Noturno" className="shift-icon"/>;
        }
    };


    return (
        <>
            <div className="course-detail-container">
                <h1 className="course-title">{course.courseDTO?.nome}
                    {course.shift && (
                        <span className="shift-icon-wrapper">
                        {getShiftImage(course.shift)}
                    </span>
                    )}

                    <div className={"course-title-action"}>
                        <i onClick={()=>console.log("ola")} className="icon-star" aria-hidden="true"></i>
                    </div>
                </h1>

                <h2 className="course-subtitle">{institution?.nomeIes || course.institutionName || "A carregar..."}</h2>

                {/*//info geral*/}
                <p><strong>Área de estudo:</strong>{course.courseDTO?.nomeAreaEstudo}</p>
                <p><strong>Regime de acesso:</strong> {course.accessRegime}</p>
                <p><strong>Estado do curso:</strong> {course.courseDTO?.estadoCursoDGES}</p>

                {/*//sobre o curso*/}
                <p><strong>Horário:</strong> {course.shift}</p>
                <p><strong>Ects:</strong> {course.courseDTO?.ects}</p>
                <p><strong>Grau:</strong> {course.courseDTO?.grau}</p>
                <p><strong>Ano académico:</strong> {course.academicYear}</p>
                <p><strong>Vagas:</strong> {course.vacancies}</p>

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
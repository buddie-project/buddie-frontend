import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";
import api from "../services/api.js";
import {useUserContext} from "../services/UserContext.jsx";

function CourseDetails() {
    const {courseId} = useParams();
    const [course, setCourse] = useState(null);
    const [institution, setInstitution] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const userId = useUserContext().user?.id;

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

    useEffect(() => {
        if (courseId) {
            api.get(`/api/courses/${courseId}/favorites`)
                .then((res) => {
                    const favorites = res.data;
                    const isFav = favorites.some(fav => fav.user.id === userId);
                    setIsFavorite(isFav);
                })
                .catch((err) => console.error("Erro ao obter favoritos:", err));
        }
    }, [courseId]);


    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;


    const getShiftImage = (shiftValue) => {

        if (shiftValue === "Diurno") {
            return <img src="../../public/icons/day-study.png" alt="Estudo Diurno" className="shift-icon"/>;
        }
        if (shiftValue === "Pós-laboral") {
            return <img src="../../public/icons/night-study.png" alt="Estudo Noturno" className="shift-icon"/>;
        }
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            api.post(`/api/courses/${courseId}/favorites/delete`)
                .then(() => setIsFavorite(false))
                .catch((err) => console.error("Erro ao remover dos favoritos:", err));
        } else {
            api.post(`/api/courses/${courseId}/favorites`)
                .then(() => setIsFavorite(true))
                .catch((err) => console.error("Erro ao adicionar aos favoritos:", err));
        }
    };

    const institutionIdFromCourseDTO = course.courseDTO?.instituicaoId


    return (
        <>
            <h3 className="back-container" onClick={event=>window.history.back()}> <i className="icon-left-arrow" aria-hidden="true"></i>Cursos</h3>
            <div className="course-detail-container">
                <h1 className="course-title" key={course.courseDTO?.nome}>{course.courseDTO?.nome}
                    {course.shift && (
                        <span className="shift-icon-wrapper">
                        {getShiftImage(course.shift)}
                    </span>
                    )}

                    <div className={"course-title-action"}>
                        <i
                            onClick={toggleFavorite}
                            className={isFavorite ? "icon-star-filled" : "icon-star"}
                            aria-hidden="true"
                        ></i>
                    </div>
                </h1>
                {/*<h2 className="course-subtitle">{institution?.nomeIes || course.institutionName || "A carregar..."}</h2>*/}
                <h2 className="course-subtitle">
                    {institutionIdFromCourseDTO ? (
                        <Link to={`/instituicao/${institutionIdFromCourseDTO}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {course.institutionName || institution?.nomeIes || "A carregar..."}
                        </Link>
                    ) : (
                        course.institutionName || "Instituição Desconhecida"
                    )}
                </h2>

                <div className="course-info-box">
                    {/*//info geral*/}
                    <div className="left-column">
                        <p><strong>Área de estudo:</strong>{course.courseDTO?.nomeAreaEstudo}</p>
                        <p><strong>Regime de acesso:</strong> {course.accessRegime}</p>
                        <p><strong>Estado do curso:</strong> {course.courseDTO?.estadoCursoDGES}</p>


                        {/*//sobre o curso*/}

                        <p><strong>Horário:</strong> {course.shift}</p>
                        <p><strong>Ects:</strong> {course.courseDTO?.ects}</p>
                        <p><strong>Grau:</strong> {course.courseDTO?.grau}</p>
                        <p><strong>Ano académico:</strong> {course.academicYear}</p>
                    </div>

                    <div className={"right-column"}>

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
                </div>
            </div>

            <Comments/>
        </>
    );
}

export default CourseDetails;
import { useParams, Link } from "react-router-dom"; // Importar Link se ainda não estiver
import { useEffect, useState } from "react";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";
import api from "../services/api.js";
import { useUserContext } from "../services/UserContext.jsx";
import {toast} from "react-toastify"; // Importar useUserContext

function CourseDetails() {
    // CORREÇÃO ESSENCIAL AQUI: Aceder diretamente ao parâmetro 'courseId' como definido na rota do App.jsx
    const {courseId } = useParams(); // REMOVER ': id'
    const [course, setCourse] = useState(null);
    const [institution, setInstitution] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    // Obter userId do contexto do utilizador
    const { user } = useUserContext(); // Obter 'user' do contexto
    const userId = user ? user.id : null; // userId será o ID do utilizador logado, ou null se não logado

    useEffect(() => {
        // Apenas faz a chamada se courseId não for undefined ou null
        if (!courseId) {
            setCourse(null); // Assegura que o estado é limpo se o ID não for válido
            return;
        }

        api.get(`/api/courses/${courseId}`)
            .then((res) => {
                // A sua API retorna um array, mas para um único detalhe, seria mais comum retornar um objeto diretamente.
                // Ajustado para lidar com o primeiro elemento do array se houver, ou a própria data se for um objeto.
                const courseData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : res.data;

                if (courseData) {
                    setCourse(courseData);

                    // Acessar instituicaoId do courseData.courseDTO para consistência
                    if (courseData.courseDTO?.instituicaoId) {
                        api.get(`/api/institution/${courseData.courseDTO.instituicaoId}`)
                            .then((instRes) => setInstitution(instRes.data))
                            .catch((err) => console.error("Erro ao encontrar detalhes da instituição:", err));
                    }
                } else {
                    setCourse(null);
                }
            })
            .catch((err) => {
                console.error("Erro ao carregar detalhes do curso:", err);
                setCourse(null); // Limpar o curso em caso de erro
            });
    }, [courseId]); // Dependência em courseId

    useEffect(() => {
        // Apenas faz a chamada se courseId e userId estiverem disponíveis
        // Apenas tenta obter favoritos se o utilizador estiver logado (userId existe)
        if (!courseId || !userId) {
            setIsFavorite(false); // Não é favorito se não houver ID de curso ou utilizador
            return;
        }

        api.get(`/api/courses/${courseId}/favorites`)
            .then((res) => {
                const favorites = res.data;
                // Certifica-se de que favorites é um array antes de usar .some()
                const isFav = Array.isArray(favorites) && favorites.some(fav => fav.user?.id === userId); // Acesso seguro a fav.user.id
                setIsFavorite(isFav);
            })
            .catch((err) => console.error("Erro ao obter favoritos:", err));
    }, [courseId, userId]); // Dependências em courseId e userId

    // Exibir mensagem de carregamento ou "não encontrado"
    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;

    const getShiftImage = (shiftValue) => {
        if (shiftValue === "Diurno") {
            return <img src="/icons/day-study.png" alt="Estudo Diurno" className="shift-icon" />; // CORREÇÃO DO CAMINHO
        }
        if (shiftValue === "Pós-laboral") {
            return <img src="/icons/night-study.png" alt="Estudo Noturno" className="shift-icon"/>; // CORREÇÃO DO CAMINHO
        }
        return null; // Retorna null se não houver correspondência
    };

    const toggleFavorite = () => {
        // Apenas permite toggle se userId for válido (utilizador logado)
        if (!userId) {
            console.warn("Utilizador não autenticado para adicionar/remover favoritos.");
            toast.info("Por favor, faça login para adicionar aos favoritos.", { theme: "colored" }); // Feedback ao utilizador
            return;
        }

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

    const institutionIdFromCourseDTO = course.courseDTO?.instituicaoId;

    return (
        <>
            <h3 className="back-container" onClick={event=>window.history.back()}> <i className="icon-left-arrow" aria-hidden="true"></i>Cursos</h3>
            <div className="course-detail-container">
                <h1 className="course-title" key={course.courseDTO?.nome}>
                    {course.courseDTO?.nome}
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
                    <div className="left-column">
                        <p><strong>Área de estudo:</strong> {course.courseDTO?.nomeAreaEstudo}</p>
                        <p><strong>Regime de acesso:</strong> {course.accessRegime}</p>
                        <p><strong>Estado do curso:</strong> {course.courseDTO?.estadoCursoDGES}</p>

                        <p><strong>Horário:</strong> {course.shift}</p>
                        <p><strong>Ects:</strong> {course.courseDTO?.ects}</p>
                        <p><strong>Grau:</strong> {course.courseDTO?.grau}</p>
                        <p><strong>Ano académico:</strong> {course.academicYear}</p>
                    </div>

                    <div className={"right-column"}>
                        <p><strong>Vagas:</strong> {course.vacancies}</p>
                        <p><strong>Requisitos:</strong> {course.rankingCriteria}</p>
                        <p><strong>Descrição:</strong> {course.description}</p>

                        <p><strong>Localidade:</strong> {course.courseDTO?.localidade}</p>
                        <p>
                            <strong>Site da universidade:</strong>{" "}
                            {course.sourceUrl ? (
                                <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    {course.sourceUrl}
                                </a>
                            ) : (
                                "Não disponível"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* CORREÇÃO AQUI: Passar o courseId para o componente Comments */}
            <Comments courseId={courseId} />
        </>
    );
}

export default CourseDetails;
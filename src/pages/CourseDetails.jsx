import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/CourseDetails.css";
import Comments from "../components/generalComponents/Comments.jsx";
import api from "../services/api.js";
import { useUserContext } from "../services/UserContext.jsx";
import {toast} from "react-toastify";

/**
 * @typedef {object} CourseDetailsData
 * @property {object} courseDTO - Objeto com os detalhes básicos do curso (nome, área, estado, etc.).
 * @property {string} [courseDTO.nome] - Nome do curso.
 * @property {string} [courseDTO.nomeAreaEstudo] - Nome da área de estudo.
 * @property {string} [courseDTO.estadoCursoDGES] - Estado do curso na DGES.
 * @property {number} [courseDTO.instituicaoId] - ID da instituição.
 * @property {number} [courseDTO.ects] - Créditos ECTS do curso.
 * @property {string} [courseDTO.grau] - Grau académico do curso.
 * @property {string} [courseDTO.localidade] - Localidade do curso.
 * @property {string} [accessRegime] - Regime de acesso ao curso.
 * @property {string} [shift] - Turno do curso (Diurno, Pós-laboral).
 * @property {string} [academicYear] - Ano académico do curso.
 * @property {number} [vacancies] - Número de vagas.
 * @property {string} [rankingCriteria] - Critérios de seriação.
 * @property {string} [description] - Descrição do curso.
 * @property {string} [sourceUrl] - URL da fonte (site da universidade).
 * @property {string} [institutionName] - Nome da instituição (pode vir diretamente com o curso).
 */

/**
 * @typedef {object} InstitutionData
 * @property {number} id - ID da instituição.
 * @property {string} nomeIes - Nome da instituição.
 * // ... outras propriedades da instituição
 */

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {boolean} loading - Indica se o contexto do utilizador está a carregar.
 */

/**
 * Componente CourseDetails.
 * Exibe os detalhes completos de um curso específico, incluindo informações da instituição,
 * dados do concurso (se aplicável) e a funcionalidade de adicionar/remover dos favoritos.
 * Também integra o componente de comentários.
 * @returns {JSX.Element} O componente CourseDetails.
 */
function CourseDetails() {
    /**
     * Hook para obter os parâmetros da URL, incluindo o `courseId`.
     * @type {{courseId: string}}
     */
    const {courseId } = useParams();
    /**
     * Estado para armazenar os dados detalhados do curso.
     * @type {CourseDetailsData|null}
     */
    const [course, setCourse] = useState(null);
    /**
     * Estado para armazenar os dados da instituição associada ao curso.
     * @type {InstitutionData|null}
     */
    const [institution, setInstitution] = useState(null);
    /**
     * Estado para indicar se o curso atual é favorito do utilizador logado.
     * @type {boolean}
     */
    const [isFavorite, setIsFavorite] = useState(false);
    /**
     * Hook para aceder ao contexto do utilizador.
     * @type {UserContextObject}
     */
    const { user } = useUserContext();
    /**
     * O ID do utilizador logado, ou null se não estiver autenticado.
     * @type {string|number|null}
     */
    const userId = user ? user.id : null;

    /**
     * Efeito para buscar os detalhes do curso e da instituição associada.
     * É executado sempre que o `courseId` muda.
     */
    useEffect(() => {
        if (!courseId) {
            setCourse(null);
            return;
        }

        api.get(`/api/courses/${courseId}`)
            .then((res) => {
                const courseData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : res.data;

                if (courseData) {
                    setCourse(courseData);

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
                setCourse(null);
            });
    }, [courseId]);

    /**
     * Efeito para verificar o status de favorito do curso para o utilizador logado.
     * É executado sempre que `courseId` ou `userId` mudam.
     */
    useEffect(() => {
        if (!courseId || !userId) {
            setIsFavorite(false);
            return;
        }

        api.get(`/api/courses/${courseId}/isFavorite`)
            .then((res) => {
                setIsFavorite(res.data);
            })
            .catch((err) => {
                console.error("Erro ao verificar status de favorito:", err);
                setIsFavorite(false);
            });
    }, [courseId, userId]);

    // Exibe mensagem de carregamento ou "curso não encontrado" enquanto os dados são buscados.
    if (!course) return <div className="loading">A carregar detalhes ou curso não encontrado...</div>;

    /**
     * Retorna o elemento de imagem do ícone de turno com base no valor fornecido.
     * @param {string} shiftValue - O valor do turno (ex: "Diurno", "Pós-laboral").
     * @returns {JSX.Element|null} O elemento `<img>` para o ícone do turno, ou `null` se não corresponder.
     */
    const getShiftImage = (shiftValue) => {
        if (shiftValue === "Diurno") {
            return <img src="/icons/day-study.png" alt="Estudo Diurno" className="shift-icon" />;
        }
        if (shiftValue === "Pós-laboral") {
            return <img src="/icons/night-study.png" alt="Estudo Noturno" className="shift-icon"/>;
        }
        return null;
    };

    /**
     * Alterna o status de favorito do curso (adiciona/remove dos favoritos).
     * Requer que o utilizador esteja autenticado.
     */
    const toggleFavorite = () => {
        if (!userId) {
            console.warn("Utilizador não autenticado para adicionar/remover favoritos.");
            toast.info("Por favor, faça login para adicionar aos favoritos.", { theme: "colored" });
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

    /**
     * Obtém o ID da instituição a partir do DTO do curso.
     * Usado para criar o link para a página de detalhes da instituição.
     * @type {string|number|undefined}
     */
    const institutionIdFromCourseDTO = course.courseDTO?.instituicaoId;

    return (
        <>
            <div className="background-course-details">
                <div className="background-image">
                    <img src="/images/background-color.jpg" alt="Background Image" className="background-image"/>
                </div>
            </div>
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

            <Comments courseId={courseId} />
        </>
    );
}

export default CourseDetails;
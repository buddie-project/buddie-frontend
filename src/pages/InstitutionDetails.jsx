import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/InstitutionDetails.css";
import api from "../services/api.js";
import { toast } from 'react-toastify';

/**
 * @typedef {object} InstitutionDetailsData
 * @property {number} id - O ID da instituição.
 * @property {string} nomeIes - O nome da instituição.
 * @property {string} tipoIes - O tipo da instituição (ex: "Universidade", "Politécnico").
 * @property {string} localidade - A localidade da instituição.
 * @property {string} distrito - O distrito da instituição.
 * @property {string} [urlIes] - O URL do website da instituição.
 * @property {string} [urlLogo] - O URL do logótipo da instituição.
 * @property {string} [email] - O email de contacto da instituição.
 * @property {string} [telefone] - O telefone de contacto da instituição.
 * @property {string} [fax] - O número de fax da instituição.
 * @property {string} [morada] - A morada completa da instituição.
 * @property {string} [cp] - O código postal da instituição.
 */

/**
 * @typedef {object} CourseSummaryData
 * @property {number} courseId - O ID do curso.
 * @property {string} courseName - O nome do curso.
 * @property {string} fieldOfStudy - A área de estudo do curso.
 * @property {string} institutionName - O nome da instituição do curso.
 * @property {number} institutionId - O ID da instituição do curso.
 */

/**
 * Componente InstitutionDetails.
 * Exibe os detalhes de uma instituição de ensino superior específica,
 * incluindo informações de contacto e uma lista de cursos associados.
 * @returns {JSX.Element} O componente InstitutionDetails.
 */
function InstitutionDetails() {
    /**
     * Hook para obter os parâmetros da URL, incluindo o `id` da instituição.
     * @type {{id: string}}
     */
    const { id } = useParams();
    /**
     * Estado para armazenar os detalhes da instituição.
     * @type {InstitutionDetailsData|null}
     */
    const [institution, setInstitution] = useState(null);
    /**
     * Estado para armazenar a lista de cursos oferecidos pela instituição.
     * @type {CourseSummaryData[]}
     */
    const [courses, setCourses] = useState([]);
    /**
     * Estado para indicar se os dados estão a ser carregados.
     * @type {boolean}
     */
    const [loading, setLoading] = useState(true);
    /**
     * Estado para armazenar mensagens de erro.
     * @type {string|null}
     */
    const [error, setError] = useState(null);

    /**
     * Efeito para buscar os detalhes da instituição e os seus cursos.
     * É executado sempre que o `id` da instituição muda.
     */
    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError("ID da instituição não fornecido.");
            return;
        }

        const fetchInstitutionDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Buscar detalhes da instituição
                const instRes = await api.get(`/api/institution/${id}`);
                setInstitution(instRes.data);

                // Buscar cursos da instituição
                const coursesRes = await api.get(`/api/institution/${id}/courses`);
                setCourses(coursesRes.data);

            } catch (err) {
                console.error("Erro ao carregar detalhes da instituição ou cursos:", err);
                setError("Não foi possível carregar os detalhes da instituição. Por favor, tente novamente.");
                toast.error("Erro ao carregar detalhes da instituição.", { theme: "colored" });
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutionDetails();
    }, [id]);

    // Exibe mensagem de carregamento.
    if (loading) return <div className="loading">A carregar detalhes da instituição...</div>;
    // Exibe mensagem de erro.
    if (error) return <div className="error-message">{error}</div>;
    // Exibe mensagem se a instituição não for encontrada após o carregamento.
    if (!institution) return <div className="no-data">Instituição não encontrada.</div>;

    return (
        <div className="institution-details-container">
            <h3 className="back-container" onClick={event => window.history.back()}> <i className="icon-left-arrow" aria-hidden="true"></i>Instituições</h3>

            <div className="institution-header">
                <div className="institution-logo-name">
                    {institution.urlLogo && (
                        <img src={institution.urlLogo} alt={`${institution.nomeIes} Logo`} className="institution-logo" />
                    )}
                    <h1 className="institution-name">{institution.nomeIes}</h1>
                </div>
                <p className="institution-type">{institution.tipoIes}</p>
            </div>

            <div className="institution-info-box">
                <div className="info-column">
                    <h4>Localização</h4>
                    <p><strong>Localidade:</strong> {institution.localidade}</p>
                    <p><strong>Distrito:</strong> {institution.distrito}</p>
                    <p><strong>Morada:</strong> {institution.morada || 'Não disponível'}</p>
                    <p><strong>Código Postal:</strong> {institution.cp || 'Não disponível'}</p>
                </div>

                <div className="info-column">
                    <h4>Contacto</h4>
                    <p><strong>Email:</strong> {institution.email || 'Não disponível'}</p>
                    <p><strong>Telefone:</strong> {institution.telefone || 'Não disponível'}</p>
                    <p><strong>Fax:</strong> {institution.fax || 'Não disponível'}</p>
                    <p>
                        <strong>Website:</strong>{" "}
                        {institution.urlIes ? (
                            <a href={institution.urlIes} target="_blank" rel="noopener noreferrer">
                                {institution.urlIes}
                            </a>
                        ) : (
                            "Não disponível"
                        )}
                    </p>
                </div>
            </div>

            <div className="institution-courses-section">
                <h2>Cursos Oferecidos</h2>
                {courses.length > 0 ? (
                    <div className="courses-list">
                        {courses.map(course => (
                            <Link to={`/cursos/${course.courseId}`} key={course.courseId} className="course-item-link">
                                <div className="course-item">
                                    <h3>{course.courseName}</h3>
                                    <p>{course.fieldOfStudy}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum curso encontrado para esta instituição.</p>
                )}
            </div>
        </div>
    );
}

export default InstitutionDetails;
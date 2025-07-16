import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Certifique-se que useCallback está importado
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../services/UserContext.jsx";
import api from "../../services/api.js";
import AutocompleteDropdown from "../generalComponents/AutocompleteDropdown.jsx";

function AdminPage() {
    const [activeTab, setActiveTab] = useState('GerirUtilizadores');
    const [formData, setFormData] = useState({ avatar: '' });
    const [activePage] = useState('Administração');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);
    const { user, logout } = useUserContext();
    const navigate = useNavigate();

    const userIdFromContext = user ? user.id : null;

    const initialCourseForm = {
        nome: "",
        nomeAreaEstudo: "",
        nomeInstituicao: "",
        distrito: "",
        estadoCursoDGES: "",
        grau: "",
        ects: "",
        localidade: "",
        courseDescription: "",
        codigoCurso: ""
    };
    const [courseForm, setCourseForm] = useState(initialCourseForm);

    const [courseNamesList, setCourseNamesList] = useState([]);
    const [institutionNamesList, setInstitutionNamesList] = useState([]);
    const [areasList, setAreasList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [statusOptionsList, setStatusOptionsList] = useState([]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const coursesNamesRes = await api.get("/api/courses/distinct-names");
                setCourseNamesList(coursesNamesRes.data);

                const institutionNamesRes = await api.get("/api/institution/distinct-names");
                setInstitutionNamesList(institutionNamesRes.data);

                const areasRes = await api.get("/api/courses/distinct-areas");
                setAreasList(areasRes.data);

                const districtsRes = await api.get("/api/institution/distinct-districts");
                setDistrictsList(districtsRes.data);

                const statusesRes = await api.get("/api/courses/distinct-statuses");
                setStatusOptionsList(statusesRes.data);
            } catch (err) {
                console.error("Erro ao carregar opções de filtro:", err);
                toast.error("Erro ao carregar opções de filtro. Algumas opções podem estar indisponíveis.", {theme: "colored"});
            }
        };
        fetchFilterOptions();
    }, []);

    // CORREÇÃO: Envolver handleCourseFormChange com useCallback para estabilizar a referência.
    const handleCourseFormChange = useCallback((fieldName, value) => {
        console.log(`Debug: handleCourseFormChange - Field: ${fieldName}, Value: ${value}`);
        setCourseForm(prev => ({
            ...prev,
            [fieldName]: value
        }));
    }, []); // Array de dependências vazio, pois setCourseForm é estável.


    // Handler para adicionar curso
    // Também envolver handleAddCourse com useCallback se for passado para filhos
    const handleAddCourse = useCallback(async () => {
        if (!courseForm.nome || !courseForm.nomeInstituicao || !courseForm.nomeAreaEstudo || !courseForm.distrito || !courseForm.estadoCursoDGES || !courseForm.grau) {
            toast.error("Por favor, preencha todos os campos obrigatórios para o curso.", {theme: "colored"});
            return;
        }

        try {
            let institutionId = null;
            try {
                const institutionRes = await api.get(`/api/institution/byName?name=${encodeURIComponent(courseForm.nomeInstituicao)}`);
                institutionId = institutionRes.data.id;
            } catch (instErr) {
                console.error("Erro ao buscar ID da instituição por nome:", instErr);
                toast.error("Instituição não encontrada. Por favor, selecione uma instituição válida.", {theme: "colored"});
                return;
            }

            const courseDTOToSend = {
                codigoCurso: courseForm.codigoCurso || null,
                ects: courseForm.ects || null,
                estadoCursoDGES: courseForm.estadoCursoDGES,
                grau: courseForm.grau,
                localidade: courseForm.localidade || null,
                nome: courseForm.nome,
                nomeAreaEstudo: courseForm.nomeAreaEstudo,
                courseDescription: courseForm.courseDescription || null,
                instituicaoId: institutionId,
                nomeInstituicao: courseForm.nomeInstituicao,
            };

            await api.post("/api/courses", courseDTOToSend);
            toast.success("Curso adicionado com sucesso!");
            setCourseForm(initialCourseForm);
        } catch (error) {
            console.error("Erro ao adicionar curso:", error);
            const errorMessage = error.response?.data?.message || "Erro ao adicionar curso.";
            toast.error(errorMessage, {theme: "colored"});
        }
    }, [courseForm]); // Depende de courseForm para garantir que tem o estado mais recente.


    // Código de gestão de utilizadores e upload de imagem (mantido como está)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Assegurar que handleImageUpload é também useCallback se user ou userIdFromContext mudam
    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file || !userIdFromContext) {
            toast.warn("Por favor, selecione um ficheiro e certifique-se que está logado.", {theme: 'colored'});
            return;
        }

        const form = new FormData();
        form.append('image', file);
        form.append('user_id', userIdFromContext);
        form.append('type', 'avatar');

        try {
            const config = { headers: {'Content-Type': 'multipart/form-data'} };
            const { data } = await api.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Imagem enviada com sucesso!', { theme: 'colored' });
            setFormData(prev => ({ ...prev, avatar: data.link }));
        } catch (error) {
            console.error("Erro ao adicionar imagem:", error);
            toast.error('Erro ao carregar imagem', { theme: 'colored' });
        }
    }, [userIdFromContext]); // Depende de userIdFromContext

    const triggerFileInput = () => avatarInputRef.current.click();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleSearchChange = (e) => { setSearchQuery(e.target.value); };
    const performUserSearch = useCallback(async (query) => { /* ... */ }, []);
    useEffect(() => { /* ... */ }, [searchQuery, performUserSearch]);


    return (
        <>
            <section className="cards">
                <button className="profile-menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✖' : '☰'}
                </button>

                <div className={`container-card-one ${isMenuOpen ? 'open' : ''}`}>
                    <h2 className="card-one-title">área pessoal</h2>
                    <div className="card-one">
                        <div className="profile-avatar-container" onClick={triggerFileInput}>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <img
                                src={formData.avatar || 'https://placehold.co/150'}
                                alt="Profile avatar"
                                className="profile-avatar"
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="avatar-upload-hint">@{user ? user.username : 'Carregando...'}</div>
                        </div>
                        <div className="profile-menu-admin">
                            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="icon-user"></i>Administração
                            </NavLink>
                            <button onClick={() => { logout(); navigate("/"); }}>
                                <i className="icon-logout"></i>Terminar Sessão
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container-card-two">
                    <h2 className="card-two-title">{activeTab === 'GerirUtilizadores' ? 'Gerir Utilizadores' : activeTab === 'AprovacaoComentarios' ? 'Aprovação Comentários' : 'Adicionar Cursos'}</h2>
                    <div className="card-two">
                        <div className="sections">
                            <div className="admin-tabs">
                                <button className={activeTab === 'GerirUtilizadores' ? 'active' : ''}
                                        onClick={() => setActiveTab('GerirUtilizadores')}>
                                    Gerir Utilizadores
                                </button>
                                <button className={activeTab === 'AprovacaoComentarios' ? 'active' : ''}
                                        onClick={() => setActiveTab('AprovacaoComentarios')}>
                                    Aprovação Comentários
                                </button>
                                <button className={activeTab === 'AdicionarCursos' ? 'active' : ''}
                                        onClick={() => setActiveTab('AdicionarCursos')}>
                                    Adicionar Cursos
                                </button>
                            </div>

                            {activeTab === 'GerirUtilizadores' && (
                                <div key="GerirUtilizadores" className="tab-content manage-users-tab">
                                    <input className="search-user"
                                           type="text"
                                           placeholder="Pesquisar por email ou username"
                                           value={searchQuery}
                                           onChange={handleSearchChange}
                                    />
                                    {isSearching && <p>Pesquisando...</p>}
                                    <div className="user-results">
                                        {searchResults.length > 0 ? (
                                            searchResults.map(userResult => (
                                                <div key={userResult.id} className="user-item">
                                                    <div className="user-info">
                                                        <p className="user-username">@{userResult.username}</p>
                                                        <p>{userResult.email}</p>
                                                        <p>Role atual: <strong>{userResult.role}</strong></p>
                                                    </div>
                                                    <div className="user-actions">
                                                        <button
                                                            className={userResult.role === 'ADMIN' ? 'demote-btn' : 'promote-btn'}
                                                            onClick={async () => {
                                                                try {
                                                                    const newRole = userResult.role === 'ADMIN' ? 'USER' : 'ADMIN';
                                                                    await api.post(`/api/users/${userResult.id}/role?newRole=${newRole}`);
                                                                    toast.success(`Role de ${userResult.username} atualizada para ${newRole}`, { theme: 'colored' });

                                                                    setSearchResults(prevResults =>
                                                                        prevResults.map(u =>
                                                                            u.id === userResult.id ? { ...u, role: newRole } : u
                                                                        )
                                                                    );
                                                                } catch (error) {
                                                                    console.error("Erro ao atualizar role:", error);
                                                                    toast.error('Erro ao atualizar o role do utilizador.', { theme: 'colored' });
                                                                }
                                                            }}
                                                        >
                                                            {userResult.role === 'ADMIN' ? 'Remover Admin' : 'Tornar Admin'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            searchQuery.trim() && !isSearching && <p>Nenhum utilizador encontrado.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'AprovacaoComentarios' && (
                                <div key="AprovacaoComentarios" className="tab-content comments-list">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div className="comment-item" key={index}>
                                            <div className="comment-info">
                                                <div className="comment-avatar" />
                                                <div>
                                                    <p className="comment-username">@username_{index}</p>
                                                    <p className="comment-text">Comentário de exemplo...</p>
                                                </div>
                                            </div>
                                            <div className="comment-actions">
                                                <button>Aceitar</button>
                                                <button>Bloquear</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'AdicionarCursos' && (
                                <div key="AdicionarCursos" className="tab-content add-course-form">
                                    {/* Campo de escrita livre para o nome do curso */}
                                    <input
                                        className="curso"
                                        placeholder="Adicione o nome do curso"
                                        value={courseForm.nome}
                                        onChange={(e) => handleCourseFormChange("nome", e.target.value)}
                                    />

                                    {/* NOVO: Input para Código DGES do Curso (agora visível, se aplicável) */}
                                    <input
                                        className="codigo-dges"
                                        placeholder="Código DGES do Curso (opcional)"
                                        value={courseForm.codigoCurso || ""}
                                        onChange={(e) => handleCourseFormChange("codigoCurso", e.target.value)}
                                    />
                                    <AutocompleteDropdown
                                        label="área de estudo"
                                        options={areasList}
                                        value={courseForm.nomeAreaEstudo}
                                        onValueChange={(value) => handleCourseFormChange("nomeAreaEstudo", value)}
                                    />
                                    <AutocompleteDropdown
                                        label="instituição"
                                        options={institutionNamesList}
                                        value={courseForm.nomeInstituicao}
                                        onValueChange={(value) => handleCourseFormChange("nomeInstituicao", value)}
                                    />
                                    <AutocompleteDropdown
                                        label="distrito"
                                        options={districtsList}
                                        value={courseForm.distrito}
                                        onValueChange={(value) => handleCourseFormChange("distrito", value)}
                                    />
                                     {/*NOVO: Autocomplete para Estado do Curso (Status DGES)
                                    <AutocompleteDropdown
                                        label="status DGES"
                                        options={statusOptionsList}
                                        value={courseForm.estadoCursoDGES}
                                        onValueChange={(value) => handleCourseFormChange("estadoCursoDGES", value)}
                                    />*/}
                                    {/* NOVOS INPUTS: ECTS, Localidade, Descrição */}
                                    <input
                                        className="ects"
                                        placeholder="ECTS (ex: 60)"
                                        type="number"
                                        value={courseForm.ects || ""}
                                        onChange={(e) => handleCourseFormChange("ects", e.target.value)}
                                    />
                                    {/*<input
                                        className="localidade"
                                        placeholder="Localidade"
                                        value={courseForm.localidade || ""}
                                        onChange={(e) => handleCourseFormChange("localidade", e.target.value)}
                                    />*/}
                                    {/*<textarea
                                        className="course-description"
                                        placeholder="Descrição do Curso"
                                        value={courseForm.courseDescription || ""}
                                        onChange={(e) => handleCourseFormChange("courseDescription", e.target.value)}
                                        rows="3"
                                    />*/}
                                    {/* Select para Grau (Tipo de Curso) */}
                                    <select
                                        value={courseForm.grau}
                                        onChange={(e) => handleCourseFormChange("grau", e.target.value)}
                                    >
                                        <option value="">- Selecione o Grau -</option>
                                        <option value="Licenciatura 1º Ciclo">Licenciatura 1º Ciclo</option>
                                        <option value="Mestrado Integrado">Mestrado Integrado</option>
                                        <option value="Mestrado">Mestrado</option>
                                        <option value="Doutoramento">Doutoramento</option>
                                    </select>
                                    <button className="add-course-btn" onClick={handleAddCourse}>Adicionar Curso</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="bottom-gradient-line"></div>
        </>
    );
}

export default AdminPage;
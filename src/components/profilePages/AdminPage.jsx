import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

    // ✅ Estados dos filtros e listas
    const initialFilters = {
        curso: "",
        instituicao: "",
        area: "",
        distrito: "",
        status: "",
    };
    const [filters, setFilters] = useState(initialFilters);
    const [courseNames, setCourseNames] = useState([]);
    const [institutionNames, setInstitutionNames] = useState([]);
    const [areas, setAreas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]); // caso queiras usar status distintos vindos da API

    // Buscar nomes distintos
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const coursesNamesRes = await api.get("/api/courses/distinct-names");
                setCourseNames(coursesNamesRes.data);

                const institutionNamesRes = await api.get("/api/institution/distinct-names");
                setInstitutionNames(institutionNamesRes.data);

                const areasRes = await api.get("/api/courses/distinct-areas");
                setAreas(areasRes.data);

                const districtsRes = await api.get("/api/institution/distinct-districts");
                setDistricts(districtsRes.data);

                const statusesRes = await api.get("/api/courses/distinct-statuses");
                setStatusOptions(statusesRes.data);
            } catch (err) {
                console.error("Erro ao carregar opções de filtro:", err);
            }
        };
        fetchFilterOptions();
    }, []);

    // Handler de alteração dos filtros
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Handler para adicionar curso
    const handleAddCourse = async () => {
        try {
            await api.post("/api/courses", filters);
            toast.success("Curso adicionado com sucesso!");
            setFilters(initialFilters); // limpar formulário
        } catch (error) {
            console.error("Erro ao adicionar curso:", error);
            toast.error("Erro ao adicionar curso.");
        }
    };

    // Pesquisa de utilizadores
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const user_id_from_context = user ? user.id : null;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user_id_from_context) return;

        const form = new FormData();
        form.append('image', file);
        form.append('user_id', user_id_from_context);
        form.append('type', 'avatar');

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Imagem enviada com sucesso!', { theme: 'colored' });
            setFormData(prev => ({ ...prev, avatar: data.link }));
        } catch (error) {
            toast.error('Erro ao enviar imagem', { theme: 'colored' });
        }
    };

    const triggerFileInput = () => avatarInputRef.current.click();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const performUserSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Erro ao pesquisar utilizadores:", error);
            toast.error('Erro ao pesquisar utilizadores.', { theme: 'colored' });
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            performUserSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, performUserSearch]);

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
                    <h2 className="card-two-title">{activePage}</h2>
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
                                <div className="tab-content">
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
                                                    <p>@{userResult.username}</p>
                                                    <p>{userResult.email}</p>
                                                    <p>Role: {userResult.role}</p>
                                                </div>
                                            ))
                                        ) : (
                                            searchQuery.trim() && !isSearching && <p>Nenhum utilizador encontrado.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'AprovacaoComentarios' && (
                                <div className="tab-content comments-list">
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
                                <div className="tab-content add-course-form">
                                    <input className="curso" placeholder="Adicione o nome do curso" value={filters.curso} onChange={(e) => handleFilterChange("curso", e.target.value)}></input>
                                    <AutocompleteDropdown
                                        label="area"
                                        options={areas}
                                        value={filters.area}
                                        onValueChange={(value) => handleFilterChange("area", value)}
                                    />
                                    <AutocompleteDropdown
                                        label="instituicao"
                                        options={institutionNames}
                                        value={filters.instituicao}
                                        onValueChange={(value) => handleFilterChange("instituicao", value)}
                                    />
                                    <AutocompleteDropdown
                                        label="distrito"
                                        options={districts}
                                        value={filters.distrito}
                                        onValueChange={(value) => handleFilterChange("distrito", value)}
                                    />
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange("status", e.target.value)}
                                    >
                                        <option>- Adicione o tipo de curso -</option>
                                        <option>Licenciatura 1º Ciclo</option>
                                        <option>Mestrado Integrado</option>
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

import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../services/UserContext.jsx";
import api from "../../services/api.js";
import AutocompleteDropdown from "../generalComponents/AutocompleteDropdown.jsx";

/**
 * Componente AdminPage.
 * Esta página permite aos administradores gerir utilizadores, aprovar comentários e adicionar novos cursos.
 * @returns {JSX.Element} O componente AdminPage.
 */
function AdminPage() {
    /**
     * Estado para controlar a aba ativa na área de administração.
     * Pode ser 'GerirUtilizadores', 'AprovacaoComentarios' ou 'AdicionarCursos'.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [activeTab, setActiveTab] = useState('GerirUtilizadores');
    /**
     * Estado para armazenar dados de formulário, como o avatar do utilizador.
     * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
     */
    const [formData, setFormData] = useState({ avatar: '' });
    /**
     * Título da página atual (fixo como 'Administração').
     * @type {string}
     */
    const [activePage] = useState('Administração');
    /**
     * Estado para controlar a abertura/fecho do menu de navegação móvel do perfil.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    /**
     * Referência para o input de ficheiro do avatar (oculto).
     * Usado para acionar o clique programaticamente.
     * @type {React.RefObject<HTMLInputElement>}
     */
    const avatarInputRef = useRef(null);
    /**
     * Hook para aceder ao contexto do utilizador, contendo informações do utilizador logado e a função de logout.
     * @type {{user: object|null, logout: () => Promise<void>}}
     */
    const { user, logout } = useUserContext();
    /**
     * Hook para navegação programática entre rotas.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * Objeto de estado inicial para os filtros de curso, usado no formulário de adicionar cursos.
     * @type {object}
     */
    const initialFilters = {
        curso: "",
        instituicao: "",
        area: "",
        distrito: "",
        status: "",
    };
    /**
     * Estado para os dados do formulário de adição de cursos.
     * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
     */
    const [filters, setFilters] = useState(initialFilters);
    /**
     * Estado para armazenar a lista de nomes de cursos distintos para o AutocompleteDropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [courseNames, setCourseNames] = useState([]);
    /**
     * Estado para armazenar a lista de nomes de instituições distintas para o AutocompleteDropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [institutionNames, setInstitutionNames] = useState([]);
    /**
     * Estado para armazenar a lista de áreas de estudo distintas para o AutocompleteDropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [areas, setAreas] = useState([]);
    /**
     * Estado para armazenar a lista de distritos distintos para o AutocompleteDropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [districts, setDistricts] = useState([]);
    /**
     * Estado para armazenar a lista de opções de status de cursos distintos para o AutocompleteDropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [statusOptions, setStatusOptions] = useState([]);

    /**
     * Efeito para buscar as opções de filtro para os AutocompleteDropdowns.
     * É executado uma vez no carregamento do componente.
     */
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
                toast.error("Erro ao carregar opções de filtro. Algumas opções podem estar indisponíveis.", {theme: "colored"});
            }
        };
        fetchFilterOptions();
    }, []);

    /**
     * Lida com a mudança nos campos do formulário de adição de curso.
     * @param {string} filterName - O nome do campo do formulário a ser atualizado.
     * @param {string|number} value - O novo valor do campo.
     */
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    /**
     * Lida com a submissão do formulário para adicionar um novo curso.
     * Valida os campos obrigatórios e envia os dados para a API.
     */
    const handleAddCourse = async () => {
        // Validação básica dos campos do formulário
        if (!filters.curso || !filters.instituicao || !filters.area || !filters.distrito || !filters.status) {
            toast.error("Por favor, preencha todos os campos obrigatórios para o curso.", {theme: "colored"});
            return;
        }

        try {
            await api.post("/api/courses", filters);
            toast.success("Curso adicionado com sucesso!");
            setFilters(initialFilters); // Limpa o formulário após sucesso
        } catch (error) {
            console.error("Erro ao adicionar curso:", error);
            toast.error("Erro ao adicionar curso.");
        }
    };

    /**
     * Estado para a query de pesquisa de utilizadores.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [searchQuery, setSearchQuery] = useState('');
    /**
     * Estado para os resultados da pesquisa de utilizadores.
     * @type {[Array<object>, React.Dispatch<React.SetStateAction<Array<object>>>]}
     */
    const [searchResults, setSearchResults] = useState([]);
    /**
     * Estado para indicar se a pesquisa de utilizadores está em andamento.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isSearching, setIsSearching] = useState(false);
    /**
     * O ID do utilizador do contexto, ou null se não estiver autenticado.
     * Usado para a funcionalidade de upload de imagem.
     * @type {number|null}
     */
    const user_id_from_context = user ? user.id : null;

    /**
     * Lida com o upload de imagem do avatar.
     * Envia o ficheiro para a API e atualiza o avatar no perfil.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input de ficheiro.
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        // Verifica se um ficheiro foi selecionado e se o ID do utilizador está disponível.
        // Assume-se que 'user_id_from_context' é a fonte de verdade para o ID do utilizador.
        if (!file || !user_id_from_context) {
            toast.warn("Por favor, selecione um ficheiro e certifique-se que está logado.", {theme: 'colored'});
            return;
        }

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
            // Log do erro completo para depuração, mas apenas exibe uma mensagem genérica ao utilizador
            console.error("Erro ao enviar imagem:", error);
            toast.error('Erro ao enviar imagem', { theme: 'colored' });
        }
    };

    /**
     * Aciona programaticamente o clique no input de ficheiro do avatar.
     */
    const triggerFileInput = () => avatarInputRef.current.click();
    /**
     * Alterna o estado de abertura/fecho do menu móvel do perfil.
     */
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    /**
     * Lida com a mudança no campo de pesquisa de utilizadores.
     * Atualiza o estado da query de pesquisa.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
     */
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Executa a pesquisa de utilizadores com base na query fornecida.
     * Se a query estiver vazia ou contiver apenas espaços, limpa os resultados.
     * Memoizado com useCallback para otimização.
     * @param {string} query - A string de pesquisa.
     */
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

    /**
     * Efeito para aplicar "debouncing" à pesquisa de utilizadores.
     * A pesquisa é executada apenas após um pequeno atraso (500ms) desde a última alteração na `searchQuery`.
     * Isso evita chamadas excessivas à API enquanto o utilizador está a escrever.
     */
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
                                <div className="tab-content manage-users-tab">
                                    <input
                                        type="text"
                                        className="search-user"
                                        placeholder="Pesquisar utilizadores por username ou email..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />

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
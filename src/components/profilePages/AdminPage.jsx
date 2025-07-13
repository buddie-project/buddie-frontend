import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
//import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import {NavLink, useNavigate} from "react-router-dom";
import {useUserContext} from "../../services/UserContext.jsx";
import api from "../../services/api.js";

function AdminPage() {
    const [activeTab, setActiveTab] = useState('GerirUtilizadores');
    const [formData, setFormData] = useState({ avatar: '' });
    const [activePage] = useState('Administração');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);
    //const context = useUserContext();
    const { user, logout } = useUserContext(); // Obter user e logout do contexto
    const navigate = useNavigate();

    // Estados para a funcionalidade de pesquisa de utilizadores
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Para armazenar os utilizadores encontrados
    const [isSearching, setIsSearching] = useState(false); // Para indicar estado de carregamento da pesquisa

    //const cookies = new Cookies();
    // const user_id = cookies.get('xyz');
    // user_id deve vir do contexto do utilizador, não de cookies diretamente para o user logado
    // ou se o cookie xyz contiver o ID, certifique-se que está bem gerido.
    // Para o contexto do utilizador logado, o user.id já está disponível.
    const user_id_from_context = user ? user.id : null;

    useEffect(() => {
        const fetchUserImages = async () => {
            // Verifique se user_id_from_context está disponível antes de fazer a chamada
            if (!user_id_from_context) return;
            try {
                const config = { headers: { "Content-Type": "application/json" } };
                const avatarResponse = await api.post(
                    `/api/auth/ImageRetrieve`,
                    { user_id: user_id_from_context, type: 'avatar' } // Usar o ID do contexto
                );

                setFormData({ avatar: avatarResponse.data.link });
            } catch (error) {
                toast.error('Error loading images', { theme: 'colored' });
            }
        };
        fetchUserImages();
    }, [user_id_from_context]); // Dependência agora do user_id do contexto

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user_id_from_context) return; // Verificar se há ficheiro e ID de utilizador

        const form = new FormData();
        form.append('image', file);
        form.append('user_id', user_id_from_context);
        form.append('type', 'avatar');

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Image uploaded successfully!', { theme: 'colored' });
            setFormData(prev => ({ ...prev, avatar: data.link }));
        } catch (error) {
            toast.error('Error uploading image', { theme: 'colored' });
        }
    };

    const triggerFileInput = () => avatarInputRef.current.click();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Função para lidar com a mudança no campo de pesquisa
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Função para realizar a pesquisa de utilizadores
    const performUserSearch = useCallback(async (query) => {
        if (!query.trim()) { // Se a query estiver vazia, limpar resultados e sair
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            // Invocando o endpoint de pesquisa de utilizadores com a instância 'api'
            const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
            setSearchResults(response.data); // Assumindo que a resposta é um array de utilizadores
        } catch (error) {
            console.error("Erro ao pesquisar utilizadores:", error);
            toast.error('Erro ao pesquisar utilizadores.', { theme: 'colored' });
            setSearchResults([]); // Limpar resultados em caso de erro
        } finally {
            setIsSearching(false);
        }
    }, []); // Dependências vazias, pois a query é passada como argumento

    // Efeito para debouncing na pesquisa
    useEffect(() => {
        const handler = setTimeout(() => {
            performUserSearch(searchQuery);
        }, 500); // Debounce de 500ms

        return () => {
            clearTimeout(handler); // Limpar o timeout anterior se a query mudar rapidamente
        };
    }, [searchQuery, performUserSearch]); // Executar quando searchQuery ou performUserSearch mudar

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
                            <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-user"></i>Administração</NavLink>
                            {/*                            <NavLink to="/conta" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-user"></i>Conta</NavLink>
                            <NavLink to="/perfil/configuracoes" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-config"></i>Configurações</NavLink>*/}
                            <button onClick={() => {logout(); navigate("/"); }}><i className="icon-logout"></i>Terminar Sessão</button>
                        </div>
                    </div>
                </div>

                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Administração' && (
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
                                               onChange={handleSearchChange} // Lidar com as mudanças no input
                                        />
                                        {isSearching && <p>Pesquisando...</p>} {/* Indicador de carregamento */}
                                        <div className="user-results">
                                            {/* Exibir os resultados da pesquisa */}
                                            {searchResults.length > 0 ? (
                                                searchResults.map(userResult => (
                                                    <div key={userResult.id} className="user-item">
                                                        <p>@{userResult.username}</p>
                                                        <p>{userResult.email}</p>
                                                        <p>Role: {userResult.role}</p>
                                                        {/* Adicionar botões de ação como "Editar Role" ou "Eliminar" aqui */}
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
                                        {/* Conteúdo existente para aprovação de comentários (dados mockados) */}
                                        {[1, 2, 3, 4].map((comment, index) => (
                                            <div className="comment-item" key={index}>
                                                <div className="comment-info">
                                                    <div className="comment-avatar" />
                                                    <div>
                                                        <p className="comment-username">@username_{index}</p>
                                                        <p className="comment-text">setheshra raeh aerhaerth rhaerh reh...</p>
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
                                        <select>
                                            <option>- Selecione ou escreva um curso -</option>
                                            <option>Curso 1</option>
                                            <option>Curso 2</option>
                                            <option>Curso 3</option>
                                            <option>Curso 4</option>
                                        </select>
                                        <select>
                                            <option>- Selecione ou escreva a área do curso -</option>
                                            <option>Inglês</option>
                                            <option>Filosofia</option>
                                            <option>Português</option>
                                            <option>Matemática</option>
                                        </select>
                                        <select>
                                            <option>- Selecione ou escreva uma instituição -</option>
                                            <option>IADE</option>
                                            <option>ISCTE</option>
                                            <option>Universidade Lusíada</option>
                                            <option>Universidade Católica</option>
                                        </select>
                                        <input type="number" placeholder="- Número total de vagas -" />
                                        <input type="date" />
                                        <button className="add-course-btn">Adicionar Curso</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <div className="bottom-gradient-line"></div>
        </>
    );
}

export default AdminPage;

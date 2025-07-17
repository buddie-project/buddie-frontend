import '../../style/profilePages/ProfileLayout.css';
import React, {useState, useRef, useEffect} from 'react';
import {Outlet, NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useUserContext} from "../../services/UserContext.jsx";
import api from "../../services/api.js";

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {function(): Promise<void>} logout - Função para terminar a sessão do utilizador.
 * @property {boolean} loading - Indica se o contexto do utilizador está a carregar.
 */

/**
 * @typedef {function(...*): void} NavigateFunction
 * Representa a função de navegação do React Router DOM.
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */

/**
 * Componente ProfileLayout.
 * Este layout é a estrutura base para as páginas de perfil do utilizador.
 * Contém a navegação lateral do perfil e uma área para renderizar o conteúdo das sub-rotas.
 * Gere o upload e exibição do avatar do utilizador e o estado do menu móvel.
 * @returns {JSX.Element} O componente ProfileLayout.
 */
function ProfileLayout() {
    /**
     * Estado para armazenar os dados do formulário, incluindo o URL do avatar.
     * Inicializado com um placeholder genérico.
     * @type {object}
     */
    const [formData, setFormData] = useState({avatar: 'https://placehold.co/150'}); // Inicializado com o placeholder
    /**
     * Estado para controlar a abertura/fecho do menu de navegação móvel do perfil.
     * @type {boolean}
     */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    /**
     * Referência para o input de ficheiro do avatar (oculto).
     * Usado para acionar o clique programaticamente.
     * @type {React.RefObject<HTMLInputElement>}
     */
    const avatarInputRef = useRef(null);
    /**
     * Hook para aceder ao contexto do utilizador, contendo o objeto de utilizador logado e a função de logout.
     * @type {UserContextObject}
     */
    const { user, logout, loading: userContextLoading } = useUserContext();
    /**
     * Hook para navegação programática.
     * @type {NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * O ID do utilizador do contexto, usado para fazer chamadas de API relacionadas ao utilizador.
     * É null se o objeto `user` for null (ex: durante o carregamento inicial ou se não houver utilizador logado).
     * @type {number|null}
     */
    const userIdFromContext = user?.id;

    // REMOVIDO: O useEffect que fazia a chamada à API ImageRetrieve foi removido.
    // Agora, o avatar será sempre o placeholder definido no useState inicial,
    // a menos que a funcionalidade de upload de avatar seja usada.

    /**
     * Lida com o upload de um novo ficheiro de imagem para o avatar.
     * Envia o ficheiro para a API e atualiza o URL do avatar no estado local.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input de ficheiro.
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user || !user.id) { // Usar user.id diretamente
            toast.warn("Por favor, faça login para carregar imagens ou selecione um ficheiro válido.", {theme: 'colored'});
            return;
        }

        const form = new FormData();
        form.append('image', file);
        form.append('user_id', user.id); // Usar user.id diretamente
        form.append('type', 'avatar');

        try {
            const config = { headers: {'Content-Type': 'multipart/form-data'} };
            const {data} = await api.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Image uploaded successfully!', {theme: 'colored'});
            setFormData(prev => ({...prev, avatar: data.link})); // Atualiza com o URL da nova imagem
        } catch (error) {
            console.error("Erro ao carregar imagem:", error);
            toast.error('Erro ao carregar imagem', {theme: 'colored'});
        }
    };

    /**
     * Aciona programaticamente o clique no input de ficheiro do avatar.
     * Isso permite que o utilizador selecione um ficheiro clicando na imagem do avatar.
     */
    const triggerFileInput = () => avatarInputRef.current.click();
    /**
     * Alterna o estado de abertura/fecho do menu de navegação móvel do perfil.
     */
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <button className="profile-menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? '✖' : '☰'}
            </button>
            <section className="cards">
                <div className={`container-card-one ${isMenuOpen ? 'open' : ''}`}>
                    <h2 className="card-one-title">área pessoal</h2>
                    <div className="card-one">
                        <div className="profile-avatar-container" onClick={triggerFileInput}>
                            <input type="file"
                                   ref={avatarInputRef}
                                   onChange={handleImageUpload}
                                   accept="image/*"
                                   style={{display: 'none'}}
                            />
                            {/* EXIBIR: Avatar do formulário ou um placeholder padrão.
                                O src agora é sempre o valor de formData.avatar,
                                que é inicializado como placeholder e atualizado no upload. */}
                            <img src={formData.avatar}
                                 alt="Profile avatar"
                                 className="profile-avatar"
                                 style={{cursor: 'pointer' }}
                            />
                            {/* EXIBIR: Nome de utilizador do contexto. Se 'user' for null, mostra "Carregando..." */}
                            <div className="avatar-upload-hint">@{user ? user.username : 'Carregando...'}</div>
                        </div>
                        <div className="profile-menu">
                            <NavLink to="/perfil/conta" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-user"></i>Conta</NavLink>
                            <NavLink to="/perfil/favoritos" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-star"></i>Favoritos</NavLink>
                            <NavLink to="/perfil/ver-mais-tarde" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-bookmark"></i>Ver mais tarde</NavLink>
                            <NavLink to="/perfil/notificacoes" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-bell"></i>Notificações</NavLink>
                            <NavLink to="/perfil/interacoes" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-interactions"></i>Interações</NavLink>
                            <NavLink to="/perfil/calendario" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-calendar"></i>Calendário</NavLink>
                            <NavLink to="/perfil/configuracoes" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-config"></i>Configurações</NavLink>
                            <button onClick={() => { logout(); navigate("/"); }}><i className="icon-logout"></i>Terminar Sessão</button>
                        </div>
                    </div>
                </div>
                {/* O Outlet renderiza os componentes filhos das rotas aninhadas */}
                <Outlet/>
            </section>
        </>
    );
}

export default ProfileLayout;
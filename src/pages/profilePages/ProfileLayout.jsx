import '../../style/profilePages/ProfileLayout.css';
import React, {useState, useRef, useEffect} from 'react';
import {Outlet, NavLink, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useUserContext} from "../../services/UserContext.jsx";
import api from "../../services/api.js";

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
     * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
     */
    const [formData, setFormData] = useState({avatar: ''});
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
     * Hook para aceder ao contexto do utilizador, contendo o objeto de utilizador logado e a função de logout.
     * @type {{user: object|null, logout: () => Promise<void>}}
     */
    const { user, logout } = useUserContext();
    /**
     * Hook para navegação programática.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * O ID do utilizador do contexto, usado para fazer chamadas de API relacionadas ao utilizador.
     * É null se o objeto `user` for null (ex: durante o carregamento inicial ou se não houver utilizador logado).
     * @type {number|null}
     */
    const userIdFromContext = user?.id;

    /**
     * Efeito para buscar e carregar a imagem de perfil do utilizador.
     * É executado sempre que `userIdFromContext` muda.
     */
    useEffect(() => {
        /**
         * Função assíncrona para buscar o URL da imagem de perfil do utilizador.
         * Define um avatar padrão se o utilizador não estiver logado ou se houver um erro.
         */
        const fetchUserImages = async () => {
            if (!userIdFromContext) {
                setFormData({ avatar: 'https://placehold.co/150' });
                return;
            }
            try {
                const config = { headers: {"Content-Type": "application/json"} };
                const avatarResponse = await api.post(`/api/ImageRetrieve`, {user_id: userIdFromContext, type: 'avatar'}, config);
                setFormData({avatar: avatarResponse.data.link});
            } catch (error) {
                console.error("Erro ao carregar imagens do perfil:", error);
                toast.error('Erro ao carregar imagens', {theme: 'colored'});
                setFormData({ avatar: 'https://placehold.co/150' });
            }
        };
        fetchUserImages();
    }, [userIdFromContext]);

    /**
     * Lida com o upload de um novo ficheiro de imagem para o avatar.
     * Envia o ficheiro para a API e atualiza o URL do avatar no estado local.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input de ficheiro.
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userIdFromContext) {
            toast.warn("Por favor, faça login para carregar imagens ou selecione um ficheiro válido.", {theme: 'colored'});
            return;
        }

        const form = new FormData();
        form.append('image', file);
        form.append('user_id', userIdFromContext);
        form.append('type', 'avatar');

        try {
            const config = { headers: {'Content-Type': 'multipart/form-data'} };
            const {data} = await api.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Image uploaded successfully!', {theme: 'colored'});
            setFormData(prev => ({...prev, avatar: data.link}));
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
                            {/* O avatar real é exibido aqui, usando `formData.avatar` ou um placeholder */}
                            <img src={formData.avatar || 'https://placehold.co/150'}
                                 alt="Profile avatar"
                                 className="profile-avatar"
                                 style={{cursor: 'pointer' }}
                            />
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
                {/* O Outlet renderiza os componentes filhos das rotas aninhadas, como Conta, Favoritos, etc. */}
                <Outlet/>
            </section>
        </>
    );
}

export default ProfileLayout;
import '../../style/profilePages/ProfileLayout.css';
import React, {useState, useRef, useEffect} from 'react';
import {Outlet, NavLink, useNavigate} from 'react-router-dom';
// import Cookies from 'universal-cookie'; // REMOVIDO: Não é mais necessário aceder diretamente a 'universal-cookie' aqui
import {toast} from 'react-toastify';
import {useUserContext} from "../../services/UserContext.jsx";
import api from "../../services/api.js"; // Importar api para as chamadas de API

function ProfileLayout() {
    const [formData, setFormData] = useState({avatar: ''});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);
    // OBTER: 'user' e 'logout' diretamente do contexto do utilizador
    const { user, logout } = useUserContext();
    const navigate = useNavigate();

    // REMOVIDO: Acesso direto a cookies
    // const cookies = new Cookies();
    // const user_id = cookies.get('xyz');

    // NOVO: Obter o ID do utilizador diretamente do objeto 'user' do contexto.
    // Usamos 'user?.id' para acesso seguro, caso o objeto 'user' seja null (ex: durante o carregamento inicial).
    const userIdFromContext = user?.id;

    useEffect(() => {
        const fetchUserImages = async () => {
            // VERIFICAR: Se o ID do utilizador do contexto está disponível antes de fazer a chamada da API.
            if (!userIdFromContext) {
                // Se não há ID, pode significar que o utilizador não está logado ou ainda está a carregar.
                // Exibir um avatar padrão neste caso.
                setFormData({ avatar: 'https://placehold.co/150' });
                return;
            }
            try {
                const config = { headers: {"Content-Type": "application/json"} };
                // USAR: 'userIdFromContext' para a chamada da API, garantindo que o ID vem do contexto centralizado.
                const avatarResponse = await api.post(`/api/ImageRetrieve`, {user_id: userIdFromContext, type: 'avatar'}, config);
                setFormData({avatar: avatarResponse.data.link});
            } catch (error) {
                console.error("Erro ao carregar imagens do perfil:", error);
                toast.error('Erro ao carregar imagens', {theme: 'colored'});
                // Em caso de erro, voltar para o avatar padrão.
                setFormData({ avatar: 'https://placehold.co/150' });
            }
        };
        // Dependência ATUALIZADA: O efeito só re-executa quando 'userIdFromContext' muda (ou seja, o utilizador muda ou faz login/logout).
        fetchUserImages();
    }, [userIdFromContext]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        // VERIFICAR: Se há um ficheiro E se o ID do utilizador do contexto está disponível.
        if (!file || !userIdFromContext) {
            toast.warn("Por favor, faça login para carregar imagens ou selecione um ficheiro válido.", {theme: 'colored'});
            return;
        }

        const form = new FormData();
        form.append('image', file);
        // USAR: 'userIdFromContext' para a submissão do formulário.
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

    // Função para acionar o input de ficheiro de forma programática.
    const triggerFileInput = () => avatarInputRef.current.click();
    // Função para alternar o estado do menu móvel.
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
                            {/* EXIBIR: Avatar do formulário ou um placeholder padrão */}
                            <img src={formData.avatar || 'https://placehold.co/150'}
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
                            {/* Botão de terminar sessão, utiliza a função 'logout' do contexto */}
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
import '../../style/profilePages/ProfileLayout.css';
import React, {useState, useRef, useEffect} from 'react';
import {Outlet, NavLink} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {toast} from 'react-toastify';
import {useUserContext} from "../../services/UserContext.jsx";

function ProfileLayout() {
    const [formData, setFormData] = useState({avatar: ''});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);
    const context = useUserContext();

    const cookies = new Cookies();
    const user_id = cookies.get('xyz');

    useEffect(() => {
        const fetchUserImages = async () => {
            try {
                const config = {headers: {"Content-Type": "application/json"}};
                const avatarResponse = await axios.post(`/api/auth/ImageRetrieve`, {user_id, type: 'avatar'}, config);
                setFormData({avatar: avatarResponse.data.link});
            } catch (error) {
                toast.error('Error loading images', {theme: 'colored'});
            }
        };
        fetchUserImages();
    }, [user_id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append('image', file);
        form.append('user_id', user_id);
        form.append('type', 'avatar');
        try {
            const config = {headers: {'Content-Type': 'multipart/form-data'}};
            const {data} = await axios.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Image uploaded successfully!', {theme: 'colored'});
            setFormData(prev => ({...prev, avatar: data.link}));
        } catch (error) {
            toast.error('Error uploading image', {theme: 'colored'});
        }
    };

    return (
        <>
            <button className="profile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? '✖' : '☰'}
            </button>
            <section className="cards">
                <div className={`container-card-one ${isMenuOpen ? 'open' : ''}`}>
                    <h2 className="card-one-title">área pessoal</h2>
                    <div className="card-one">
                        <div className="profile-avatar-container" onClick={() => avatarInputRef.current.click()}>
                            <input type="file"
                                   ref={avatarInputRef}
                                   onChange={handleImageUpload}
                                   accept="image/*"
                                   style={{display: 'none'}}
                            />
                            <img src={formData.avatar || 'https://placehold.co/150'}
                                 alt="Profile avatar"
                                 className="profile-avatar"
                            style={{cursor: 'pointer' }}
                            />
                            <div className="avatar-upload-hint">@{context.user.username}</div>
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
                            <p><i className="icon-logout"></i>Terminar Sessão</p>
                        </div>
                    </div>
                </div>
                    <Outlet/>
            </section>
        </>
    );
}

export default ProfileLayout;

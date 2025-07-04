import '../../style/profilePages/Profile.css';
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

function Profile() {
    const [formData, setFormData] = useState({ avatar: '' });
    const [activePage, setActivePage] = useState('Conta');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);

    const cookies = new Cookies();
    const user_id = cookies.get('xyz');

    useEffect(() => {
        const fetchUserImages = async () => {
            try {
                const config = { headers: { "Content-Type": "application/json" } };
                const avatarResponse = await axios.post(
                    `/api/auth/ImageRetrieve`,
                    { user_id, type: 'avatar' },
                    config
                );
                setFormData({ avatar: avatarResponse.data.link });
            } catch (error) {
                toast.error('Error loading images', { theme: 'colored' });
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
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`/api/auth/ImageUpload`, form, config);
            toast.success('Image uploaded successfully!', { theme: 'colored' });
            setFormData(prev => ({ ...prev, avatar: data.link }));
        } catch (error) {
            toast.error('Error uploading image', { theme: 'colored' });
        }
    };

    const triggerFileInput = () => avatarInputRef.current.click();
    const handlePageChange = (page) => setActivePage(page);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <section className="cards">
                {/* BOTÃO que aparece só no breakpoint */}
                <button className="profile-menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? '✖' : '☰'}
                </button>

                <div className={`container-card-one ${isMenuOpen ? 'open' : ''}`}>
                    <h2 className="card-one-title">Área Pessoal</h2>
                    <div className="card-one">
                        <div className="profile-avatar-container" onClick={triggerFileInput}>
                            <input type="file" ref={avatarInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                            <img src={formData.avatar || 'https://placehold.co/150'} alt="Profile avatar" className="profile-avatar" style={{ cursor: 'pointer' }} />
                            <div className="avatar-upload-hint">@ana_pinto</div>
                        </div>
                        <div className="profile-menu">
                            <p className={`${activePage === 'Conta' ? 'active' : ''}`} onClick={() => handlePageChange('Conta')}><i className="icon-user"></i>Conta</p>
                            <p className={`${activePage === 'Favoritos' ? 'active' : ''}`} onClick={() => handlePageChange('Favoritos')}><i className="icon-star"></i>Favoritos</p>
                            <p className={`${activePage === 'Ver mais tarde' ? 'active' : ''}`} onClick={() => handlePageChange('Ver mais tarde')}><i className="icon-bookmark"></i>Ver mais tarde</p>
                            <p className={`${activePage === 'Notificações' ? 'active' : ''}`} onClick={() => handlePageChange('Notificações')}><i className="icon-bell"></i>Notificações</p>
                            <p className={`${activePage === 'Interações' ? 'active' : ''}`} onClick={() => handlePageChange('Interações')}><i className="icon-interactions"></i>Interações</p>
                            <p className={`${activePage === 'Calendário' ? 'active' : ''}`} onClick={() => handlePageChange('Calendário')}><i className="icon-calendar"></i>Calendário</p>
                            <p className={`${activePage === 'Configurações' ? 'active' : ''}`} onClick={() => handlePageChange('Configurações')}><i className="icon-config"></i>Configurações</p>
                            <p><i className="icon-logout"></i>Terminar Sessão</p>
                        </div>
                    </div>
                </div>

                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Conta' && <div className="sections">

                            <div className="section section-one">
                                <h4>Ana Madalena Pinto</h4>
                                <p>Estudante</p>
                                <p>Lisboa, portugal</p>
                            </div>

                            <div className="section section-two">
                                <h4>Informação Pessoal</h4>

                                <div className="line">

                                    <div className="first-name">
                                        <p>Primeiro Nome</p>
                                        <p>Ana</p>
                                    </div>

                                    <div className="last-name">
                                        <p>Último Nome</p>
                                        <p>Pinto</p>
                                    </div>

                                    <div className="age">
                                        <p>Idade</p>
                                        <p>25</p>
                                    </div>
                                </div>

                                <div className="line">
                                    <div className="bio">
                                        <p>Bio</p>
                                        <p className="bio-name">Estudante</p>
                                    </div>

                                    <div className="email">
                                        <p>E-mail</p>
                                        <p className="email-adress">ana123@gmail.com</p>
                                    </div>

                                    <div className="phone">
                                        <p>Telemóvel</p>
                                        <p className="phone-number">(+351) 918 231 782</p>
                                    </div>

                                </div>
                            </div>

                            <div className="section section-three">
                                <h4>Morada</h4>
                                <div className="line">

                                    <div className="country">
                                        <p>País</p>
                                        <p className="country-name">Portugal</p>
                                    </div>

                                    <div className="city">
                                        <p>Cidade</p>
                                        <p className="city-name">Alvalade</p>
                                    </div>
                                </div>

                                <div className="line">

                                    <div className="cp">
                                        <p>Código-Postal</p>
                                        <p className="cp-number">2625-372</p>
                                    </div>

                                    <div className="district">
                                        <p>Distrito</p>
                                        <p className="district-name">Lisboa</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {activePage === 'Favoritos' && <div></div>}
                        {activePage === 'Ver mais tarde' && <div></div>}
                        {activePage === 'Notificações' && <div></div>}
                        {activePage === 'Interações' && <div></div>}
                        {activePage === 'Calendário' && <div></div>}
                        {activePage === 'Configurações' && <div></div>}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;


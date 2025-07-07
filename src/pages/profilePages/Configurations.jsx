import '../../style/profilePages/Profile.css';
import '../../style/profilePages/Configurations.css';
import React, {useEffect, useState, useRef} from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import {toast} from 'react-toastify';

function Configurations() {

    const [formData, setFormData] = useState({
        avatar: ''
    });
    const [activePage, setActivePage] = useState('Conta');
    const avatarInputRef = useRef(null);

    const cookies = new Cookies();
    const user_id = cookies.get('xyz');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);



    useEffect(() => {
        const fetchUserImages = async () => {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                const avatarResponse = await axios.post(
                    `/api/auth/ImageRetrieve`,
                    {user_id, type: 'avatar'},
                    config
                );

                setFormData({
                    avatar: avatarResponse.data.link
                });

            } catch (error) {
                toast.error('Error loading images', {
                    theme: 'colored'
                });
            }
        };

        fetchUserImages();
    }, [user_id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('user_id', user_id);
        formData.append('type', 'avatar');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const {data} = await axios.post(
                `/api/auth/ImageUpload`,
                formData,
                config
            );

            toast.success('Image uploaded successfully!', {
                theme: 'colored'
            });

            setFormData(prev => ({...prev, avatar: data.link}));

        } catch (error) {
            toast.error('Error uploading image', {
                theme: 'colored'
            });
        }
    };

    const triggerFileInput = () => {
        avatarInputRef.current.click();
    };

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <>

            <button className="profile-menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? '✖' : '☰'}
            </button>

            <section className="cards">
            <div className={`container-card-one ${isMenuOpen ? 'open' : ''}`}>
                {/*<div className="container-card-one">*/}
                    <h2 className="card-one-title">área pessoal</h2>
                    <div className="card-one">
                        <div className="profile-avatar-container" onClick={triggerFileInput}>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <img
                                src={formData.avatar || 'https://placehold.co/150'}
                                alt="Profile avatar"
                                className="profile-avatar"
                                style={{cursor: 'pointer'}}
                            />
                            <div className="avatar-upload-hint">@ana_pinto</div>
                        </div>
                        <div className="profile-menu">
                            <p
                                className={`${activePage === 'Conta' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Conta')}
                            >
                                <i className="icon-user" aria-hidden="true"></i>Conta
                            </p>
                            <p
                                className={`${activePage === 'Favoritos' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Favoritos')}
                            >
                                <i className="icon-star" aria-hidden="true"></i>Favoritos
                            </p>
                            <p
                                className={`${activePage === 'Ver mais tarde' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Ver mais tarde')}
                            >
                                <i className="icon-bookmark" aria-hidden="true"></i>Ver mais tarde
                            </p>
                            <p
                                className={`${activePage === 'Notificações' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Notificações')}
                            >
                                <i className="icon-bell" aria-hidden="true"></i>Notificações
                            </p>
                            <p
                                className={`${activePage === 'Interações' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Interações')}
                            >
                                <i className="icon-interactions" aria-hidden="true"></i>Interações
                            </p>
                            <p
                                className={`${activePage === 'Calendário' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Calendário')}
                            >
                                <i className="icon-calendar" aria-hidden="true"></i>Calendário
                            </p>
                            <p
                                className={`${activePage === 'Configurações' ? 'active' : ''}`}
                                onClick={() => handlePageChange('Configurações')}
                            >
                                <i className="icon-config" aria-hidden="true"></i>Configurações
                            </p>
                            <p><i className="icon-logout" aria-hidden="true"></i>Terminar Sessão</p>
                        </div>
                    </div>
                </div>
                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Conta' && <div>
                        </div>}
                        {activePage === 'Favoritos' && <div></div>}
                        {activePage === 'Ver mais tarde' && <div></div>}
                        {activePage === 'Notificações' && <div></div>}
                        {activePage === 'Interações' && <div></div>}
                        {activePage === 'Calendário' && <div></div>}
                        {activePage === 'Configurações' && <div className="configurations-section">

                            <div className="section section-one">
                                <h4>Informação Pessoal</h4>
                                <div className="line">
                                    <div className="inputs">
                                        <p>Primeiro Nome</p>
                                        <input className="first-name"></input>
                                    </div>
                                    <div className="inputs">
                                        <p>Último Nome</p>
                                        <input className="last-name"></input>
                                    </div>
                                    <div className="inputs">
                                        <p>Idade</p>
                                        <input className="age"></input>
                                    </div>
                                </div>

                                <div className="line">
                                    <div className="inputs">
                                        <p>Bio</p>
                                        <input className="bio"></input>
                                    </div>

                                    <div className="inputs">
                                        <p>E-mail</p>
                                        <input className="email"></input>
                                    </div>

                                    <div className="inputs">
                                        <p>Telemóvel</p>
                                        <input className="phone"></input>
                                    </div>
                                </div>
                            </div>

                            <div className="section section-two">
                                <h4>Morada</h4>

                                <div className="line">

                                    <div className="inputs">
                                        <p>País</p>
                                        <input className="country"></input>
                                    </div>

                                    <div className="inputs">
                                        <p>Cidade</p>
                                        <input className="city"></input>
                                    </div>
                                </div>
                                <div className="line">

                                    <div className="inputs">
                                        <p>Código Postal</p>
                                        <input className="zip"></input>
                                    </div>

                                    <div className="inputs">
                                        <p>Distrito</p>
                                        <input className="district"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="showProfilePicture"
                                    className="show-hide-picture"
                                />
                                <label htmlFor="showProfilePicture">Exibir foto de perfil?</label>
                            </div>


                            <div className="save-delete container">
                                <p className="save">
                                    <i className="icon-check" aria-hidden="true"></i>
                                    Guardar Alterações
                                </p>
                                <p className="delete">
                                    <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                    </svg>
                                    Eliminar Conta
                                </p>
                            </div>
                        </div>}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Configurations;

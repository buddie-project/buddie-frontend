import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import {NavLink, useNavigate} from "react-router-dom";
import {useUserContext} from "../../services/UserContext.jsx";

function AdminPage() {
    const [activeTab, setActiveTab] = useState('GerirUtilizadores');
    const [formData, setFormData] = useState({ avatar: '' });
    const [activePage] = useState('Administração');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const avatarInputRef = useRef(null);
    const context = useUserContext();
    const navigate = useNavigate();

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
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                            <div className="avatar-upload-hint">@{context.user.username}</div>
                        </div>
                        <div className="profile-menu-admin">
                            <NavLink to="/admin" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-user"></i>Administração</NavLink>
{/*                            <NavLink to="/conta" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-user"></i>Conta</NavLink>
                            <NavLink to="/configuracoes" className={({isActive}) => isActive ? 'active' : ''}><i
                                className="icon-config"></i>Configurações</NavLink>*/}
                            <button onClick={() => { context.logout(); navigate("/"); }}><i className="icon-logout"></i>Terminar Sessão</button>
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
                                        <input className="search-user" type="text"
                                               placeholder="Pesquisar por email ou username"/>
                                        {/*<i className="icon-search"></i>*/}
                                    </div>
                                    )}

                                {activeTab === 'AprovacaoComentarios' && (
                                    <div className="tab-content comments-list">
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
                                            {/*<AutocompleteDropdown
                                                label="curso"
                                                options={courseNames}
                                                value={filters.curso}
                                                // onValueChange={(value) => handleFilterChange("curso", value)}
                                                className="option"
                                            />*/}
                                        </select>
                                        <select>
                                            <option>- Selecione ou escreva a área do curso -</option>
{/*                                            <AutocompleteDropdown
                                                label="área"
                                                options={areas}
                                                value={filters.area}
                                                // onValueChange={(value) => handleFilterChange("area", value)}
                                                className="option"
                                            />*/}
                                        </select>
                                        <select>
                                            <option>- Selecione ou escreva uma instituição -</option>
  {/*                                          <AutocompleteDropdown
                                                label="instituição"
                                                options={institutionNames}
                                                value={filters.instituicao}
                                                // onValueChange={(value) => handleFilterChange("instituicao", value)}
                                                className="option"
                                            />*/}
                                        </select>
                                        <select>
                                            <option>- Selecione o grau -</option>
                                            <option>Licenciatura 1º Ciclo</option>
                                            <option>Mestrado Integrado</option>
                                        </select>
                                        <input type="location" placeholder="- Localidade -" />
                                        {/*<input type="number" placeholder="- Número total de vagas -" />*/}
                                        {/*<input type="date" />*/}
                                        <button className="add-course-btn">Adicionar Curso</button>
                                    </div>
                                )}
                            </div>

                        )}
                        {activePage === 'Conta Admin' && <div></div>}
                        {activePage === 'Configurações Admin' && <div></div>}
                    </div>
                </div>
            </section>
            <div className="bottom-gradient-line"></div>
        </>
    );
}

export default AdminPage;

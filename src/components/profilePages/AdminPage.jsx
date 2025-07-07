import '../../style/profilePages/Profile.css';
import '../../style/profilePages/AdminPage.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

function AdminPage() {
    const [activeTab, setActiveTab] = useState('GerirUtilizadores');
    const [formData, setFormData] = useState({ avatar: '' });
    const [activePage, setActivePage] = useState('Administração');
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
                            <div className="avatar-upload-hint">@ana_pinto</div>
                        </div>
                        <div className="profile-menu">
                            <p className={`${activePage === 'Administração' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Administração')}>
                                <i className="icon-user"></i>Administração
                            </p>
                            <p className={`${activePage === 'Favoritos' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Favoritos')}>
                                <i className="icon-star"></i>Favoritos
                            </p>
                            <p className={`${activePage === 'Ver mais tarde' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Ver mais tarde')}>
                                <i className="icon-bookmark"></i>Ver mais tarde
                            </p>
                            <p className={`${activePage === 'Notificações' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Notificações')}>
                                <i className="icon-bell"></i>Notificações
                            </p>
                            <p className={`${activePage === 'Interações' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Interações')}>
                                <i className="icon-interactions"></i>Interações
                            </p>
                            <p className={`${activePage === 'Calendário' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Calendário')}>
                                <i className="icon-calendar"></i>Calendário
                            </p>
                            <p className={`${activePage === 'Configurações' ? 'active' : ''}`}
                               onClick={() => handlePageChange('Configurações')}>
                                <i className="icon-config"></i>Configurações
                            </p>
                            <p><i className="icon-logout"></i>Terminar Sessão</p>
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
                                               placeholder="Pesquisar por ID, username, email ou role"/>
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

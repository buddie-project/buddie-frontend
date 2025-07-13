import '../../style/profilePages/ProfileLayout.css';
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../services/UserContext.jsx";
import api from "../../services/api.js";

function Profile() {
    const [activePage] = useState('Conta');
    const { user } = useUserContext();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            setError("Não estás logado. Por favor, faz login para continuar.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await api.get(`/api/users/profile/${user.id}`);
                setProfileData(response.data);
            } catch (err) {
                console.error("Erro ao carregar o perfil:", err);
                setError("Erro ao carregar perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    if (loading) return <div className="loading-profile">A carregar perfil...</div>;
    if (error) return <div className="error-profile">{error}</div>;

    return (
        <section className="cards">
            <div className="container-card-two">
                <h2 className="card-two-title">{activePage}</h2>
                <div className="card-two">
                    {activePage === 'Conta' && profileData && (
                        <div className="sections">
                            <div className="section section-one">
                                <h4>{profileData.fullName}</h4>
                                <p>{profileData.degree || "Estudante"}</p>
                                <p>{profileData.city}, {profileData.country}</p>
                            </div>

                            <div className="section section-two">
                                <h4>Informação Pessoal</h4>
                                <div className="line">
                                    <div className="first-name">
                                        <p>Primeiro Nome</p>
                                        <p>{profileData.firstName}</p>
                                    </div>
                                    <div className="last-name">
                                        <p>Último Nome</p>
                                        <p>{profileData.lastName}</p>
                                    </div>
                                    <div className="age">
                                        <p>Idade</p>
                                        <p>{profileData.age}</p>
                                    </div>
                                </div>
                                <div className="line">
                                    <div className="bio">
                                        <p>Bio</p>
                                        <p className="bio-name">{profileData.bio}</p>
                                    </div>
                                    <div className="email">
                                        <p>E-mail</p>
                                        <p className="email-address">{user.email}</p>
                                    </div>
                                    <div className="phone">
                                        <p>Telemóvel</p>
                                        <p className="phone-number">{profileData.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="section section-three">
                                <h4>Morada</h4>
                                <div className="line">
                                    <div className="country">
                                        <p>País</p>
                                        <p className="country-name">{profileData.country}</p>
                                    </div>
                                    <div className="city">
                                        <p>Cidade</p>
                                        <p className="city-name">{profileData.city}</p>
                                    </div>
                                </div>
                                <div className="line">
                                    <div className="cp">
                                        <p>Código Postal</p>
                                        <p className="cp-number">{profileData.zipCode}</p>
                                    </div>
                                    <div className="district">
                                        <p>Distrito</p>
                                        <p className="district-name">{profileData.district}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Profile;

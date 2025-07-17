import '../../style/profilePages/ProfileLayout.css';
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../services/UserContext.jsx";
import api from "../../services/api.js";

/**
 * Componente Profile.
 * Exibe as informações de perfil do utilizador logado, como dados pessoais e morada.
 * Permite uma visualização consolidada dos detalhes do perfil.
 * @returns {JSX.Element} O componente Profile.
 */
function Profile() {
    /**
     * Estado para o título da página ativa (fixo como 'Conta').
     * @type {string}
     */
    const [activePage] = useState('Conta');
    /**
     * Hook para aceder ao contexto do utilizador, contendo informações do utilizador logado.
     * @type {{user: object|null}}
     */
    const { user } = useUserContext();
    /**
     * Estado para armazenar os dados do perfil do utilizador.
     * @type {[object|null, React.Dispatch<React.SetStateAction<object|null>>]}
     */
    const [profileData, setProfileData] = useState(null);
    /**
     * Estado para indicar se os dados do perfil estão a ser carregados.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [loading, setLoading] = useState(true);
    /**
     * Estado para armazenar mensagens de erro caso a carga do perfil falhe.
     * @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]}
     */
    const [error, setError] = useState(null);

    /**
     * Efeito para buscar os dados do perfil do utilizador.
     * É executado sempre que o objeto `user` do contexto muda.
     */
    useEffect(() => {
        // Verifica se o utilizador está logado antes de tentar buscar o perfil.
        if (!user) {
            setLoading(false);
            setError("Não estás logado. Por favor, faz login para continuar.");
            return;
        }

        /**
         * Função assíncrona para buscar os dados do perfil do utilizador a partir da API.
         */
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
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

    // Exibe mensagem de carregamento enquanto os dados estão a ser buscados.
    if (loading) return <div className="loading-profile">A carregar perfil...</div>;
    // Exibe mensagem de erro se ocorreu um problema ao carregar o perfil.
    if (error) return <div className="error-profile">{error}</div>;

    return (
        <section className="cards">
            <div className="container-card-two">
                <h2 className="card-two-title">{activePage}</h2>
                <div className="card-two">
                    {profileData && (
                        <div className="sections">
                            <div className="section section-one">
                                <h4>{profileData.firstName} {profileData.lastName}</h4>
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
                                        <p>Apelido(s)</p>
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
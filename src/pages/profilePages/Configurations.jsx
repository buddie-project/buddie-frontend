import '../../style/profilePages/Configurations.css';
import React, {useEffect, useState} from "react";
import {useUserContext} from "../../services/UserContext.jsx";
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";

function Configurations() {
    const [activePage] = useState('Configurações');
    const {user, logout} = useUserContext();
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        age: 0,
        gender: '',
        phoneNumber: '',
        district: '',
        city: '',
        country: '',
        zipCode: '',
        bio: '',
    })

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            setError("Não estás logado. Por favor, faz login para continuar.");
            return;
        }
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/users/profile/${user.id}`);
                setProfileData({
                    fullName: response.data.fullName || "",
                    firstName: response.data.firstName || "",
                    lastName: response.data.lastName || "",
                    age: response.data.age || 0,
                    gender: response.data.gender || "",
                    phoneNumber: response.data.phoneNumber || "",
                    district: response.data.district || "",
                    city: response.data.city || "",
                    country: response.data.country || "",
                    zipCode: response.data.zipCode || "",
                    bio: response.data.bio || "",
                    imagePath: response.data.imagePath || "",
                    institution: response.data.institution || "",
                    degree: response.data.degree || "",
                });
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setError("Não foi possível carregar o perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) {
            alert("Precisas estar logado para guardar alterações.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {

            const profileDTOToSend = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                age: profileData.age,
                phoneNumber: profileData.phoneNumber,
                district: profileData.district,
                city: profileData.city,
                country: profileData.country,
                zipCode: profileData.zipCode,
                bio: profileData.bio,
            };

            await api.post(`/api/users/profile/update`, profileDTOToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert("Perfil atualizado com sucesso!");
            navigate("/perfil/conta");

        } catch (err) {
            console.error("Erro ao guardar alterações:", err);
            setError("Não foi possível guardar as alterações.");
            alert("Erro ao guardar alterações. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    // Handler para eliminar conta
    const handleDeleteAccount = async () => {
        if (!user) {
            alert("Precisas estar logado para eliminar a tua conta.");
            return;
        }
        if (window.confirm("Tem a certeza que deseja eliminar a sua conta? Esta ação é irreversível.")) {
            try {
                await api.post(`/api/users/profile/${user.id}/delete`);
                alert("Conta eliminada com sucesso!");
                logout();
            } catch (err) {
                console.error("Erro ao eliminar conta:", err);
                setError("Não foi possível eliminar a conta.");
                alert("Erro ao eliminar conta. Tente novamente.");
            }
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    if (loading) return <div className="loading-profile">A carregar perfil...</div>;
    if (error) return <div className="error-profile">{error}</div>;

    return (
        <>
            <div className="container-card-two">
                <h2 className="card-two-title">{activePage}</h2>
                <div className="card-two">
                    {activePage === 'Configurações' && profileData && (
                        <div className="configurations-section">
                            <div className="section section-one">
                            <h4>Informação Pessoal</h4>
                            <div className="line">
                                <div className="inputs">
                                    <p>Primeiro Nome</p>
                                    <input
                                        type="text"
                                        className="first-name"
                                        name="firstName"
                                        value={profileData.firstName || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="inputs">
                                    <p>Apelido(s)</p>
                                    <input
                                        type="text"
                                        className="last-name"
                                        name="lastName"
                                        value={profileData.lastName || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="inputs">
                                    <p>Idade</p>
                                    <input
                                        type="number"
                                        className="age"
                                        name="age"
                                        min="15"
                                        max="99"
                                        value={profileData.age || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="line">
                                <div className="inputs">
                                    <p>Bio</p>
                                    <textarea
                                        className="bio"
                                        name="bio"
                                        value={profileData.bio || ""}
                                        onChange={handleInputChange}
                                        style={{resize: "none", decoration: "none"}}
                                    />
                                </div>
                                <div className="inputs">
                                    <p>Telemóvel</p>
                                    <input
                                        type="tel"
                                        className="phone"
                                        name="phoneNumber"
                                        value={profileData.phoneNumber || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                </div>
                            </div>

                            <div className="section section-two">
                                <h4>Morada</h4>
                                <div className="line">
                                    <div className="inputs">
                                        <p>País</p>
                                        <input
                                            type="text"
                                            className="country"
                                            name="country"
                                            value={profileData.country || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="inputs">
                                        <p>Cidade</p>
                                        <input
                                            type="text"
                                            className="city"
                                            name="city"
                                            value={profileData.city || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="line">
                                    <div className="inputs">
                                        <p>Código Postal</p>
                                        <input
                                            type="text"
                                            className="zip"
                                            name="zipCode"
                                            value={profileData.zipCode || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="inputs">
                                        <p>Distrito</p>
                                        <input
                                            type="text"
                                            className="district"
                                            name="district"
                                            value={profileData.district || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="showProfilePicture"
                                    className="show-hide-picture"
                                    checked={profileData.showProfilePicture || false}
                                    onChange={(e) => setProfileData(prev => ({
                                        ...prev,
                                        showProfilePicture: e.target.checked
                                    }))}
                                />
                                <label htmlFor="showProfilePicture">
                                    Exibir foto de perfil?
                                </label>
                            </div>

                            <div className="save-delete container">
                                <p className="save" onClick={handleSaveChanges}>
                                    <i className="icon-check" aria-hidden="true"></i>
                                    {isSaving ? "Guardando..." : "Guardar Alterações"}
                                </p>
                                <p className="delete" onClick={handleDeleteAccount}>
                                    <svg
                                        className="delete-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"/>
                                    </svg>
                                    Eliminar Conta
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


    export default Configurations;

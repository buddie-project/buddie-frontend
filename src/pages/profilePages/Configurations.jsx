import '../../style/profilePages/Configurations.css';
import React, { useState } from "react";

function Configurations() {
    const [activePage] = useState('Configurações');

    return (
        <>
                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Configurações' && (
                            <div className="configurations-section">
                                <div className="section section-one">
                                    <h4>Informação Pessoal</h4>
                                    <div className="line">
                                        <div className="inputs">
                                            <p>Primeiro Nome</p>
                                            <input className="first-name" />
                                        </div>
                                        <div className="inputs">
                                            <p>Último Nome</p>
                                            <input className="last-name" />
                                        </div>
                                        <div className="inputs">
                                            <p>Idade</p>
                                            <input className="age" />
                                        </div>
                                    </div>
                                    <div className="line">
                                        <div className="inputs">
                                            <p>Bio</p>
                                            <input className="bio" />
                                        </div>
                                        <div className="inputs">
                                            <p>E-mail</p>
                                            <input className="email" />
                                        </div>
                                        <div className="inputs">
                                            <p>Telemóvel</p>
                                            <input className="phone" />
                                        </div>
                                    </div>
                                </div>
                                <div className="section section-two">
                                    <h4>Morada</h4>
                                    <div className="line">
                                        <div className="inputs">
                                            <p>País</p>
                                            <input className="country" />
                                        </div>
                                        <div className="inputs">
                                            <p>Cidade</p>
                                            <input className="city" />
                                        </div>
                                    </div>
                                    <div className="line">
                                        <div className="inputs">
                                            <p>Código Postal</p>
                                            <input className="zip" />
                                        </div>
                                        <div className="inputs">
                                            <p>Distrito</p>
                                            <input className="district" />
                                        </div>
                                    </div>
                                </div>
                                <div className="checkbox-container">
                                    <input type="checkbox" id="showProfilePicture" className="show-hide-picture" />
                                    <label htmlFor="showProfilePicture">Exibir foto de perfil?</label>
                                </div>
                                <div className="save-delete container">
                                    <p className="save">
                                        <i className="icon-check" aria-hidden="true"></i>
                                        Guardar Alterações
                                    </p>
                                    <p className="delete">
                                        <svg className="delete-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
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

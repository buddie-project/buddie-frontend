import '../../style/profilePages/ProfileLayout.css';
import React, { useState } from "react";

function Profile() {
    const [activePage] = useState('Conta');

    return (
        <>
            <section className="cards">
                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Conta' && (
                            <div className="sections">
                                <div className="section section-one">
                                    <h4>Ana Madalena Pinto</h4>
                                    <p>Estudante</p>
                                    <p>Lisboa, Portugal</p>
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
                                            <p className="email-address">ana123@gmail.com</p>
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
                                            <p>Código Postal</p>
                                            <p className="cp-number">2625-372</p>
                                        </div>
                                        <div className="district">
                                            <p>Distrito</p>
                                            <p className="district-name">Lisboa</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

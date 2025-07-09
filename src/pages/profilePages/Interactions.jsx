import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Interactions.css';
import React, { useState } from "react";

function Interactions() {

    const [activePage] = useState('Interações');

    return (
        <>
                <div className="container-card-two">
                    <h2 className="card-two-title">{activePage}</h2>
                    <div className="card-two">
                        {activePage === 'Conta' && <div></div>}
                        {activePage === 'Favoritos' && <div></div>}
                        {activePage === 'Ver mais tarde' && <div></div>}
                        {activePage === 'Notificações' && <div></div>}
                        {activePage === 'Interações' && <div>


                        </div>}
                        {activePage === 'Calendário' && <div></div>}
                        {activePage === 'Configurações' && <div></div>}
                    </div>
                </div>
        </>
    );
}

export default Interactions;

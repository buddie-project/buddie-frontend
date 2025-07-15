import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Interactions.css';
import React from 'react';

function Interactions() {
    const interactions = [
        { id: 1, user: 'André Mendes', action: 'gostou do teu comentário', date: '13/07/2025', color: '#FF8A00' },
        { id: 2, user: 'Beatriz Lopes', action: 'enviou-te uma mensagem', date: '12/07/2025', color: '#007bff' },
        { id: 3, user: 'Carlos Silva', action: 'respondeu ao teu comentário', date: '12/07/2025', color: '#28a745' },
        { id: 4, user: 'Diana Ferreira', action: 'comentou o novo curso', date: '11/07/2025', color: '#dc3545' },
        { id: 5, user: 'Eduardo Costa', action: 'gostou do teu comentário', date: '10/07/2025', color: '#6610f2' },
        { id: 6, user: 'Filipa Martins', action: 'enviou-te uma mensagem', date: '09/07/2025', color: '#17a2b8' },
        { id: 7, user: 'Gonçalo Pires', action: 'gostou de um novo curso', date: '08/07/2025', color: '#ffc107' },
        { id: 8, user: 'Helena Sousa', action: 'respondeu ao teu comentário', date: '07/07/2025', color: '#20c997' },
    ];

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">Interações</h2>
            <div className="card-two">
                <section className="interactions-page">
                    <div className="interactions-list">
                        {interactions.map((interaction) => (
                            <div className="interaction-card" key={interaction.id}>
                                <div className="avatar-area">
                                    <span className="avatar" style={{ backgroundColor: interaction.color }}>
                                        {interaction.user.charAt(0)}
                                    </span>
                                </div>
                                <div className="content-area">
                                    <p className="interaction-text">
                                        <strong>{interaction.user}</strong> {interaction.action}.
                                    </p>
                                    <span className="interaction-date">{interaction.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Interactions;

import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Notifications.css';
import React from 'react';

/**
 * Componente Notifications.
 * Exibe uma lista estática de notificações de exemplo para o utilizador.
 * @returns {JSX.Element} O componente Notifications.
 */
function Notifications() {
    /**
     * Array de objetos de notificação de exemplo.
     * Atualmente, os dados são estáticos.
     * @type {Array<object>}
     */
    const notifications = [
        { id: 1, type: 'like', message: 'João Silva gostou do teu comentário.', date: '13/07/2025' },
        { id: 2, type: 'comment', message: 'Maria Costa comentou: "Excelente trabalho!"', date: '12/07/2025' },
        { id: 3, type: 'alert', message: 'Prazo de inscrição termina amanhã!', date: '11/07/2025' },
        { id: 4, type: 'like', message: 'Carlos Matos gostou do teu comentário.', date: '10/07/2025' },
        { id: 5, type: 'comment', message: 'Ana Pereira respondeu ao teu comentário.', date: '09/07/2025' },
        { id: 6, type: 'alert', message: 'Nova data de teste disponível!', date: '08/07/2025' },
        { id: 7, type: 'like', message: 'Beatriz Lopes gostou do teu comentário.', date: '07/07/2025' },
    ];

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">Notificações</h2>
            <div className="card-two">
                <section className="notifications-page">
                    <div className="notifications-list">
                        {notifications.map((notif) => (
                            <div className={`notification-card ${notif.type}`} key={notif.id}>
                                <div className="icon-area">
                                    {notif.type === 'like' && <span className="icon">👍</span>}
                                    {notif.type === 'comment' && <span className="icon">💬</span>}
                                    {notif.type === 'alert' && <span className="icon">⚠️</span>}
                                </div>
                                <div className="content-area">
                                    <p className="notification-text">{notif.message}</p>
                                    <span className="notification-date">{notif.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Notifications;
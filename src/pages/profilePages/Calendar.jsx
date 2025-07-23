import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Calendar.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import CalendarLib from 'react-calendar';
import seedrandom from 'seedrandom';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { useUserContext } from "../../services/UserContext.jsx";

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {boolean} loading - Indica se o contexto do utilizador está a carregar.
 */

/**
 * @typedef {object} EventObject
 * @property {number|string} id - O ID do evento.
 * @property {string} description - A descrição do evento.
 * @property {string} startDate - A data de início do evento (formato ISO 8601).
 * @property {string} endDate - A data de fim do evento (formato ISO 8601).
 * @property {string} [courseName] - O nome do curso associado ao evento.
 * @property {string} [institutionName] - O nome da instituição associada ao evento.
 * @property {number|string} [courseId] - O ID do curso associado ao evento.
 * @property {number|string} [contestId] - O ID do concurso associado ao evento.
 */

/**
 * @typedef {object} DatesWithEventsMap
 * @property {Array<EventObject>} [key] - Um array de objetos de evento para uma data específica (formato 'YYYY-MM-DD').
 */

/**
 * @typedef {object} DayColorsMap
 * @property {string} [key] - A classe de cor para uma data específica (formato de string de data).
 */

/**
 * Componente Calendar.
 * Exibe um calendário onde os eventos públicos e privados do utilizador são marcados.
 * Eventos que duram vários dias preencherão todas as datas do seu período.
 * @returns {JSX.Element} O componente Calendar.
 */
function Calendar() {
    /**
     * Estado para o título da página atual (fixo como 'Calendário').
     * @type {string}
     */
    const [activePage] = useState('Calendário');
    /**
     * Estado para a data selecionada atualmente no calendário.
     * @type {Date}
     */
    const [selectedDate, setSelectedDate] = useState(new Date());
    /**
     * Estado para armazenar todos os eventos (públicos e privados) obtidos do backend.
     * @type {Array<EventObject>}
     */
    const [setEvents] = useState([]);
    /**
     * Estado para mapear datas (formato 'YYYY-MM-DD') a arrays de eventos que ocorrem nesse dia.
     * Facilita a aplicação de estilos e a exibição de conteúdo.
     * @type {DatesWithEventsMap}
     */
    const [datesWithEvents, setDatesWithEvents] = useState({});
    /**
     * Estado para armazenar cores aleatórias para cada dia do mês, para fins estéticos.
     * @type {DayColorsMap}
     */
    const [dayColors, setDayColors] = useState({});

    /**
     * Hook para obter o objeto 'user' do contexto, bem como o estado de carregamento.
     * @type {UserContextObject}
     */
    const { user, loading } = useUserContext();

    /**
     * Lista de classes CSS para sombras coloridas aleatórias nos dias do calendário.
     * @type {string[]}
     */
    const colorList = [
        'shadow-red', 'shadow-orange', 'shadow-yellow',
        'shadow-green', 'shadow-blue', 'shadow-purple', 'shadow-pink'
    ];

    /**
     * Efeito para buscar e processar eventos do calendário.
     * É executado sempre que o objeto `user` ou o estado `loading` mudam.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            if (loading || !user || !user.id) {
                setEvents([]);
                setDatesWithEvents({});
                return;
            }

            try {
                // Removido o parâmetro userId da URL, conforme a prática de segurança recomendada.
                // O backend deve obter o userId do SecurityContextHolder.
                const privateRes = await axios.get(`/api/calendar/private`);
                const publicRes = await axios.get(`/api/calendar/public`);
                const fetchedEvents = [...privateRes.data, ...publicRes.data];
                setEvents(fetchedEvents);

                const newDatesWithEvents = {};
                fetchedEvents.forEach(event => {
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);

                    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                        const dateString = d.toISOString().slice(0, 10);
                        if (!newDatesWithEvents[dateString]) {
                            newDatesWithEvents[dateString] = [];
                        }
                        newDatesWithEvents[dateString].push(event);
                    }
                });
                setDatesWithEvents(newDatesWithEvents);

            } catch (error) {
                console.error('Erro ao carregar eventos:', error);
                toast.error('Erro ao carregar eventos.', { theme: "colored" });
                setEvents([]);
                setDatesWithEvents({});
            }
        };
        fetchEvents();
    }, [user, loading]);

    /**
     * Gera cores aleatórias para os dias do mês, garantindo que não se repetem consecutivamente.
     * As cores são baseadas na data para consistência dentro de um determinado dia.
     * @param {Date[]} monthDates - Um array de objetos Date para os dias do mês.
     * @returns {DayColorsMap} Um objeto mapeando a representação da data (string) para uma classe de cor.
     */
    const generateColorsForMonth = (monthDates) => {
        const colors = {};
        const month = monthDates[0].getMonth();
        const year = monthDates[0].getFullYear();
        const seed = `${year}-${month}`;

        const rng = seedrandom(seed);
        const randomColor = colorList[Math.floor(rng() * colorList.length)];

        monthDates.forEach((date) => {
            colors[date.toDateString()] = randomColor;
        });

        return colors;
    };

    /**
     * Efeito para gerar as cores estéticas dos dias sempre que o mês selecionado muda.
     */
    useEffect(() => {
        const monthDates = [];
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
            monthDates.push(new Date(d));
        }
        setDayColors(generateColorsForMonth(monthDates));
    }, [selectedDate]);

    return (
        <div className="container-card-two">
            <h2 className="card-two-title">{activePage}</h2>
            <div className="card-two">
                <div className="calendar-container">
                    <CalendarLib
                        value={selectedDate}
                        onClickDay={setSelectedDate}
                        showFixedNumberOfWeeks={true}
                        tileClassName={({ date, view }) => {
                            let classes = '';
                            if (view === 'month') {
                                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const key = date.toDateString();

                                if (isCurrentMonth) {
                                    classes += dayColors[key] + ' current-month-day';
                                } else {
                                    classes += 'shadow-grey other-month-day';
                                }

                                if (isToday) {
                                    classes += ' today';
                                }

                                const dateStringYMD = date.toISOString().slice(0, 10);
                                if (datesWithEvents[dateStringYMD] && datesWithEvents[dateStringYMD].length > 0) {
                                    classes += ' has-event';
                                }
                            }
                            return classes.trim();
                        }}
                        formatDay={(locale, date) => (
                            <div className="day-number">{date.getDate()}</div>
                        )}
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
                                const dateStringYMD = date.toISOString().slice(0, 10);
                                const eventsOnThisDay = datesWithEvents[dateStringYMD];
                                if (eventsOnThisDay && eventsOnThisDay.length > 0) {
                                    return (
                                        <div className="events-indicator">
                                            {eventsOnThisDay.map((event, index) => (
                                                <div key={index} className="event-dot" title={event.description}></div>
                                            ))}
                                        </div>
                                    );
                                }
                            }
                            return null;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Calendar;
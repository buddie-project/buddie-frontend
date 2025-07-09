import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Calendar.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import CalendarLib from 'react-calendar';
import seedrandom from 'seedrandom';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

function Calendar() {
    const [activePage] = useState('Calendário');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [setEvents] = useState([]);
    const [dayColors, setDayColors] = useState({});
    const cookies = new Cookies();
    const user_id = cookies.get('xyz');

    // Lista de classes de shadows coloridas
    const colorList = [
        'shadow-red', 'shadow-orange', 'shadow-yellow',
        'shadow-green', 'shadow-blue', 'shadow-purple', 'shadow-pink'
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const privateRes = await axios.get(`/api/calendar/private?userId=${user_id}`);
                const publicRes = await axios.get(`/api/calendar/public`);
                setEvents([...privateRes.data, ...publicRes.data]);
            } catch (error) {
                toast.error('Erro ao carregar eventos.', { theme: 'colored' });
            }
        };
        fetchEvents();
    }, [user_id]);

    // Gera cores random sem repetir lado a lado
    const generateColorsForMonth = (monthDates) => {
        const colors = {};
        let prevColor = '';
        monthDates.forEach((date) => {
            let rng = seedrandom(date.toDateString());
            let randomColor;
            do {
                randomColor = colorList[Math.floor(rng() * colorList.length)];
            } while (randomColor === prevColor);
            prevColor = randomColor;
            colors[date.toDateString()] = randomColor;
        });
        return colors;
    };

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
                            if (view === 'month') {
                                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                                const key = date.toDateString();
                                if (isCurrentMonth) {
                                    return dayColors[key] + ' current-month-day';
                                } else {
                                    return 'shadow-grey other-month-day';
                                }
                            }
                        }}
                        formatDay={(locale, date) => (
                            <div className="day-number">{date.getDate()}</div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default Calendar;

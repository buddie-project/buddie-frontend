import '../../style/profilePages/ProfileLayout.css';
import '../../style/profilePages/Calendar.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
// import Cookies from 'universal-cookie'; // REMOVIDO: Não é mais necessário aceder diretamente a 'universal-cookie' aqui
import CalendarLib from 'react-calendar';
import seedrandom from 'seedrandom';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { useUserContext } from "../../services/UserContext.jsx"; // NOVO: Importar o UserContext

function Calendar() {
    const [activePage] = useState('Calendário');
    const [selectedDate, setSelectedDate] = useState(new Date());
    // A variável 'setEvents' não estava a ser usada diretamente, mas sim como um placeholder.
    // Alterada para 'events' e 'setEvents' para ser consistente com o uso de estado.
    const [events, setEvents] = useState([]);
    const [dayColors, setDayColors] = useState({});

    // NOVO: Obter o objeto 'user' do contexto.
    const { user, loading } = useUserContext(); // Incluí 'loading' para melhor gestão do estado

    // REMOVIDO: Acesso direto a cookies
    // const cookies = new Cookies();
    // const user_id = cookies.get('xyz');

    // Lista de classes de sombras coloridas
    const colorList = [
        'shadow-red', 'shadow-orange', 'shadow-yellow',
        'shadow-green', 'shadow-blue', 'shadow-purple', 'shadow-pink'
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            // VERIFICAR: Se o utilizador está carregado e autenticado (user.id existe)
            if (loading || !user || !user.id) {
                // Se ainda está a carregar, ou se não há utilizador logado, não tenta ir buscar eventos privados
                // Apenas busca eventos públicos neste caso ou exibe um estado de carregamento.
                // Ou, se os eventos privados devem depender do login, ajusta a lógica aqui.
                if (!user || !user.id) {
                    setEvents([]); // Limpa eventos se não houver utilizador
                    // Opcional: toast.info("Faça login para ver os seus eventos privados.");
                }
                return;
            }

            try {
                // USAR: user.id diretamente do contexto para eventos privados
                // NOTA: O backend não precisa do userId como @RequestParam se a autenticação for baseada em sessão.
                // A chamada `/api/calendar/private` no backend já usa SecurityContextHolder para obter o utilizador logado.
                // Se o endpoint `/api/calendar/private` realmente esperar um query param `userId`,
                // é uma má prática de segurança e deve ser alterado no backend para confiar APENAS na sessão.
                // Assumindo que o backend é seguro e obtém o ID da sessão, o `?userId=${user.id}` pode ser removido aqui.
                // Para manter compatibilidade com o código atual do backend que pode (erroneamente) depender dele, mantemos por enquanto.
                // O ideal é que `axios.get(`/api/calendar/private`);` seja suficiente.
                const privateRes = await axios.get(`/api/calendar/private?userId=${user.id}`); //
                const publicRes = await axios.get(`/api/calendar/public`); //
                setEvents([...privateRes.data, ...publicRes.data]);
            } catch (error) {
                console.error('Erro ao carregar eventos:', error);
                toast.error('Erro ao carregar eventos.', { theme: "colored" });
                setEvents([]); // Limpar eventos em caso de erro
            }
        };
        // Dependências ATUALIZADAS: O efeito re-executa quando 'user' ou 'loading' mudam.
        // 'user_id' removido das dependências, pois agora dependemos do objeto 'user' completo.
        fetchEvents();
    }, [user, loading]);

    // Gera cores aleatórias para os dias do mês, sem repetições consecutivas.
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

    // Efeito para gerar as cores dos dias sempre que o mês selecionado muda.
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
                                const isToday = date.toDateString() === new Date().toDateString();
                                const key = date.toDateString();

                                let classes = '';
                                if (isCurrentMonth) {
                                    classes += dayColors[key] + ' current-month-day';
                                } else {
                                    classes += 'shadow-grey other-month-day';
                                }

                                if (isToday) {
                                    classes += ' today';
                                }

                                return classes.trim();
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
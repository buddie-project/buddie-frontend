import "../../style/LoginAndRegister.css";
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== repeatPassword) {
            alert("As palavras-passe não coincidem!");
            return;
        }
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: newPassword
        };

        try {
            // CORREÇÃO: Endpoint para /api/signup
            await api.post("/api/signup", userData);
            alert("Registo efetuado com sucesso! Redirecionando para a página de login..."); // Usar alert() em vez de toast
            setTimeout(() => {
                navigate('/entrar'); // Redirecionar para a página de login
            }, 2000);
        } catch (error) {
            console.error('Erro ao registar:', error);

            // --- TRATAMENTO DE ERROS MAIS DETALHADO (sem react-toastify) ---
            if (error.response) {
                // O servidor respondeu com um status de erro (e.g., 4xx, 5xx)
                const status = error.response.status;
                // Tenta extrair uma mensagem do corpo da resposta, se disponível
                const errorMessage = error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Ocorreu um erro desconhecido.";

                switch (status) {
                    case 400: // Bad Request (erro de validação, e.g., campos em falta ou formato errado)
                        alert("Dados de registo inválidos: " + errorMessage);
                        break;
                    case 409: // Conflict (username/email já existe)
                        // Mensagem específica para utilizador já existente
                        alert("Erro no registo: " + (errorMessage.includes("já existe") ? errorMessage : "Este nome de utilizador ou email já está em uso. Por favor, escolha outro."));
                        break;
                    case 500: // Internal Server Error
                        alert("Erro interno no servidor. Por favor, tente novamente mais tarde.");
                        break;
                    default:
                        // Captura quaisquer outros status de erro inesperados
                        alert("Ocorreu um erro inesperado: " + errorMessage);
                }
            } else if (error.request) {
                // O pedido foi feito mas não houve resposta (problema de rede ou CORS grave)
                alert("Não foi possível conectar ao servidor. Verifique sua conexão ou o status do backend.");
            } else {
                // Algo aconteceu na configuração do pedido que desencadeou um erro
                alert("Ocorreu um erro inesperado ao processar o pedido.");
            }
        }
    };

    return (
        <>
            <div className="background-register">
                <div className="background-image">
                    <img src="/images/background-registo.jpg" alt="Background Image" className="background-image"/>
                </div>
            </div>

            <section id="contact"> {/* ID #contact para estilização */}
                <div className="contact-container"> {/* Classe para o container do formulário */}
                    <h3>registo</h3>
                    <form id="form" className="topBefore" onSubmit={handleSubmit}> {/* IDs e classes para o formulário */}
                        <div className="form-columns"> {/* Container para as duas colunas */}
                            <div className="column left-column"> {/* Primeira coluna */}
                                <label htmlFor="firstName"></label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="primeiro nome"
                                    required
                                />

                                <label htmlFor="email"></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email"
                                    required
                                />

                                <label htmlFor="newPassword"></label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="nova palavra-passe"
                                    required
                                />
                            </div>

                            <div className="column right-column"> {/* Segunda coluna */}
                                <label htmlFor="lastName"></label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="último nome"
                                    required
                                />

                                <label htmlFor="username"></label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="nome de utilizador"
                                    required
                                />

                                <label htmlFor="repeatPassword"></label>
                                <input
                                    id="repeatPassword"
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    placeholder="repetir palavra-passe"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit">registar</button>
                        <p className="login-link">Já tens conta? <a className="login-link-text" href="/entrar">Iniciar Sessão</a></p>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Register;
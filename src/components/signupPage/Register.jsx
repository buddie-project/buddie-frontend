import "../../style/LoginAndRegister.css";
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

/**
 * Componente Register.
 * Permite que novos utilizadores se registem na aplicação.
 * Realiza validação de password e envia os dados para o backend.
 * @returns {JSX.Element} O componente Register.
 */
function Register() {
    /**
     * Estado para o primeiro nome do utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [firstName, setFirstName] = useState('');
    /**
     * Estado para o apelido do utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [lastName, setLastName] = useState('');
    /**
     * Estado para o email do utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [email, setEmail] = useState('');
    /**
     * Estado para o nome de utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [username, setUsername] = useState('');
    /**
     * Estado para a nova palavra-passe.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [newPassword, setNewPassword] = useState('');
    /**
     * Estado para repetir a palavra-passe.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [repeatPassword, setRepeatPassword] = useState('');
    /**
     * Hook para navegação programática.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * Lida com a submissão do formulário de registo.
     * Valida as passwords, constrói o objeto de dados do utilizador e envia para a API.
     * Exibe alertas para feedback ao utilizador.
     * @param {Event} e - O evento de submissão do formulário.
     */
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
            await api.post("/api/signup", userData);
            alert("Registo efetuado com sucesso! Redirecionando para a página de login...");
            setTimeout(() => {
                navigate('/entrar');
            }, 2000);
        } catch (error) {
            console.error('Erro ao registar:', error);

            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Ocorreu um erro desconhecido.";

                switch (status) {
                    case 400:
                        alert("Dados de registo inválidos: " + errorMessage);
                        break;
                    case 409:
                        alert("Erro no registo: " + (errorMessage.includes("já existe") ? errorMessage : "Este nome de utilizador ou email já está em uso. Por favor, escolha outro."));
                        break;
                    case 500:
                        alert("Erro interno no servidor. Por favor, tente novamente mais tarde.");
                        break;
                    default:
                        alert("Ocorreu um erro inesperado: " + errorMessage);
                }
            } else if (error.request) {
                alert("Não foi possível conectar ao servidor. Verifique sua conexão ou o status do backend.");
            } else {
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

            <section id="contact">
                <div className="contact-container">
                    <h3>registo</h3>
                    <form id="form" className="topBefore" onSubmit={handleSubmit}>
                        <div className="form-columns">
                            <div className="column left-column">
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

                            <div className="column right-column">
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
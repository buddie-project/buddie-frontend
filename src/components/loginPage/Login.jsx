import '../../style/LoginAndRegister.css';
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../services/UserContext.jsx";
import {useState} from "react";

/**
 * Componente de login (Login).
 * Permite que os utilizadores iniciem sessão na aplicação.
 * @returns {JSX.Element} O componente Login.
 */
function Login() {
    /**
     * Estado para armazenar o email do utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [email, setEmail] = useState("");
    /**
     * Estado para armazenar a password do utilizador.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [password, setPassword] = useState("");
    /**
     * Contexto do utilizador para aceder a funções de autenticação e estado do utilizador.
     * @type {object}
     */
    const context = useUserContext();
    /**
     * Hook para navegação programática entre rotas.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * Lida com a submissão do formulário de login.
     * Envia as credenciais para o backend, atualiza o contexto do utilizador
     * e redireciona para a página de perfil em caso de sucesso.
     * @param {Event} e - O evento de submissão do formulário.
     */
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const body = new URLSearchParams();
            body.append("email", email);
            body.append("password", password);

            await api.post("/api/login", body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            });

            let response = await api.get("/api/user/logged", {withCredentials: true});
            let user = response.data;
            context.setUser(user);

            navigate("/perfil");
        } catch (e) {
            console.error("Erro ao fazer login:", e);
            alert("Erro ao fazer login. Verifique as suas credenciais.");
        }
    }

    return (
        <div>
            <div className="background-register">
                <div className="background-image">
                    <img src="/images/background-login.jpg" alt="Background Image" className="background-image"/>
                </div>
            </div>

            <section id="contact">
                <div className="contact-container">
                    <h3>iniciar sessão</h3>
                    <form id="form" className="topBefore" onSubmit={handleSubmit}>
                        <label htmlFor="email"></label>
                        <input id="email" type="text" value={email}
                               onChange={(e) => {
                                   setEmail(e.target.value);
                               }} placeholder="email"/>

                        <label htmlFor="password"></label>
                        <input id="password" type="password" value={password}
                               onChange={(e) => {
                                   setPassword(e.target.value);
                               }} placeholder="password"/>

                        <button type="submit" value="LOGIN">entrar</button>
                        <p className="register-link">Ainda não tens conta? <a className="register-link-text" href="/registar">Regista-te</a></p>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Login;
import '../../style/LoginAndRegister.css';
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../../services/UserContext.jsx";
import {useState} from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const context = useUserContext();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const body = new URLSearchParams();
            body.append("email", email);
            body.append("password", password);

            await api.post("/login", body, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            });


            let response = await api.get("/user/logado", {withCredentials: true});
            let user = response.data;
            context.setUser(user);

            navigate("/");
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

                    <button type="submit">entrar</button>
                    <p className="register-link">Ainda não tens conta? <a className="register-link-text" href="/registar">Regista-te</a></p>
                </form>
            </div>
        </section>
    </div>)
}

export default Login;
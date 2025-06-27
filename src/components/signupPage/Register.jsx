import "../../style/Register.css";
import api from "../../services/api.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

function Register() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        newPassword: "",
        repeatPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = new URLSearchParams();
        body.append("firstName", inputs.firstName);
        body.append("lastName", inputs.lastName);
        body.append("email", inputs.email);
        body.append("username", inputs.username);
        body.append("newPassword", inputs.newPassword);
        body.append("repeatPassword", inputs.repeatPassword);


        await api.post("/users", body);

        navigate("/sucessRegister", {
            state: {
                name: inputs.username,
            }
        });        await api.post("/users", body);

        navigate("/sucessRegister", {
            state: {
                name: inputs.username,
            }
        });
    }

    return (
        <>
            <div className="background-register">
                <div className="background-image">
                    <img src="/images/background-registo.jpg" alt="Background Image" className="background-image"/>
                </div>
            </div>

            <section id="contact">
                <h1>registo</h1>
                <div className="contact-container">
                    <form id="form" className="topBefore" onSubmit={handleSubmit}>
                        <label htmlFor="firstName"></label>
                        <input id="firstName" type="text" value={inputs.firstName}
                               onChange={(e) => setInputs({...inputs, firstName: e.target.value})}
                               placeholder="primeiro nome"/>

                        <label htmlFor="lastName"></label>
                        <input id="lastName" type="text" value={inputs.lastName}
                               onChange={(e) => setInputs({...inputs, lastName: e.target.value})}
                               placeholder="último nome"/>

                        <label htmlFor="email"></label>
                        <input id="email" type="email" value={inputs.email}
                               onChange={(e) => setInputs({...inputs, email: e.target.value})}
                               placeholder="email"/>

                        <label htmlFor="username"></label>
                        <input id="username" type="text" value={inputs.username}
                               onChange={(e) => setInputs({...inputs, username: e.target.value})}
                               placeholder="nome de utilizador"/>

                        <label htmlFor="newPassword"></label>
                        <input id="newPassword" type="password" value={inputs.newPassword}
                               onChange={(e) => setInputs({...inputs, newPassword: e.target.value})}
                               placeholder="nova palavra-passe"/>

                        <label htmlFor="repeatPassword"></label>
                        <input id="repeatPassword" type="password" value={inputs.repeatPassword}
                               onChange={(e) => setInputs({...inputs, repeatPassword: e.target.value})}
                               placeholder="repetir palavra-passe"/>

                        <button type="submit">registar</button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Register;
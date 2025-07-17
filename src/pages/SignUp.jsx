import Register from "../components/signupPage/Register.jsx";
import "../style/LoginAndRegister.css";

/**
 * Componente SignUp.
 * Esta página atua como um invólucro (wrapper) para o componente de Registo.
 * @returns {JSX.Element} O componente SignUp que renderiza o formulário de Registo.
 */
function SignUp() {
    return (
        <>
            <Register />
        </>
    );
}
export default SignUp;
import Login from "../components/loginPage/Login.jsx";
import "../style/LoginAndRegister.css";

/**
 * Componente SignIn.
 * Esta página atua como um invólucro (wrapper) para o componente de Login.
 * @returns {JSX.Element} O componente SignIn que renderiza o formulário de Login.
 */
function SignIn() {
    return (
        <>
            <Login />
        </>
    );
}
export default SignIn;
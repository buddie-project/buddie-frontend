import {Navigate} from "react-router-dom";
import {useUserContext} from "../services/UserContext.jsx";

const ProtectedRoute = ({children}) => {
    const context = useUserContext();

    if(!context.user) {
        return <Navigate to="/entrar" replace />;
    }

    return children;
}

export default ProtectedRoute;

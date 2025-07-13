import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../services/UserContext'; // Importar o hook useUserContext

/**
 * Componente ProtectedRoute.
 * Utilizado para proteger rotas no React Router DOM, verificando a autenticação do utilizador
 * e os seus privilégios (roles).
 *
 * @param {Array<string>} [allowedRoles] - Um array de strings com os roles permitidos para aceder a esta rota (ex: ['USER', 'ADMIN']).
 * Se não for fornecido, a rota é protegida apenas por autenticação (qualquer role autenticado).
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useUserContext(); // Obter o utilizador e o estado de carregamento do contexto

    console.log('ProtectedRoute: User', user);
    console.log('ProtectedRoute: Loading', loading);
    console.log('ProtectedRoute: Allowed Roles', allowedRoles);
    if (user) {
        console.log('ProtectedRoute: User Role', user.role);
        console.log('ProtectedRoute: Is Role Allowed?', allowedRoles.includes(user.role));
    }

    // Enquanto os dados do utilizador estão a ser carregados, não renderizar nada (ou um spinner de carregamento)
    if (loading) {
        return <div>Verificando autenticação...</div>; // Ou um componente de spinner
    }

    // 1. Verificar Autenticação:
    // Se o utilizador não estiver logado (user é null), redireciona para a página de login.
    if (!user) {
        return <Navigate to="/entrar" replace />;
    }

    // 2. Verificar Permissões (Roles):
    // Se `allowedRoles` foi especificado E o role do utilizador não está na lista de roles permitidos,
    // redireciona para uma página de acesso negado ou para a homepage.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redireciona para a homepage ou para uma página de "acesso negado"
        console.warn(`Acesso negado para o utilizador ${user.username} com role ${user.role}.`);
        return <Navigate to="/" replace />; // Ou para "/acesso-negado" se tiver uma página dedicada
    }

    // Se o utilizador estiver autenticado e tiver as permissões necessárias,
    // renderiza o conteúdo da rota protegida.
    return <Outlet />;
};

export default ProtectedRoute;
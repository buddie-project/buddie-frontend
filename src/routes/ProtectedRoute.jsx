import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../services/UserContext';

/**
 * @typedef {object} ProtectedRouteProps
 * @property {Array<string>} [allowedRoles] - Um array de strings com os roles permitidos para aceder a esta rota (ex: ['USER', 'ADMIN']).
 * Se não for fornecido, a rota é protegida apenas por autenticação (qualquer role autenticado).
 */

/**
 * Componente ProtectedRoute.
 * Utilizado para proteger rotas no React Router DOM, verificando a autenticação do utilizador
 * e os seus privilégios (roles).
 *
 * @param {ProtectedRouteProps} props - As propriedades do componente.
 * @returns {JSX.Element} O conteúdo da rota protegida ou um componente `Maps` para redirecionamento.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    /**
     * Obtém o objeto de utilizador e o estado de carregamento do contexto do utilizador.
     * @type {{user: object|null, loading: boolean}}
     */
    const { user, loading } = useUserContext();

    // Estes console.log são para depuração e podem ser removidos em produção.
    console.log('ProtectedRoute: User', user);
    console.log('ProtectedRoute: Loading', loading);
    console.log('ProtectedRoute: Allowed Roles', allowedRoles);
    if (user) {
        console.log('ProtectedRoute: User Role', user.role);
        console.log('ProtectedRoute: Is Role Allowed?', allowedRoles.includes(user.role));
    }

    /**
     * Enquanto os dados do utilizador estão a ser carregados, renderiza uma mensagem de carregamento.
     * Isso evita renderizar a página protegida com um estado de utilizador indefinido.
     */
    if (loading) {
        return <div>Verificando autenticação...</div>;
    }

    /**
     * 1. Verifica a Autenticação:
     * Se o utilizador não estiver logado (`user` é `null`), redireciona para a página de login.
     */
    if (!user) {
        return <Navigate to="/entrar" replace />;
    }

    /**
     * 2. Verifica as Permissões (Roles):
     * Se `allowedRoles` foi especificado E o `role` do utilizador não está na lista de roles permitidos,
     * redireciona para a homepage ou para uma página de "acesso negado".
     */
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Acesso negado para o utilizador ${user.username} com role ${user.role}.`);
        return <Navigate to="/" replace />;
    }

    /**
     * Se o utilizador estiver autenticado e tiver as permissões necessárias,
     * renderiza o conteúdo da rota protegida através do `Outlet`.
     */
    return <Outlet />;
};

export default ProtectedRoute;
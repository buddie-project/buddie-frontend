import { createContext, useContext, useEffect, useState } from "react";
import api from "./api.js";

/**
 * Contexto do utilizador. O valor inicial é null.
 * @type {React.Context<object|null>}
 */
const UserContext = createContext(null);

/**
 * Hook personalizado para consumir o contexto do utilizador.
 * Permite que qualquer componente filho aceda aos dados e funções fornecidas pelo UserProvider.
 * @returns {object|null} O objeto de contexto do utilizador.
 */
export const useUserContext = () => useContext(UserContext);

/**
 * Componente Provedor do Utilizador.
 * Responsável por gerir o estado global do utilizador (autenticado/não autenticado)
 * e por fornecer funções de login/logout aos seus componentes filhos.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 * @returns {JSX.Element} O provedor do contexto do utilizador.
 */
const UserProvider = ({ children }) => {
    /**
     * Estado para armazenar os dados do utilizador logado.
     * Espera-se que este objeto contenha propriedades como id, username, email, e role (ex: "USER", "ADMIN").
     * @type {[object|null, React.Dispatch<React.SetStateAction<object|null>>]}
     */
    const [user, setUser] = useState(null);

    /**
     * Estado para indicar se os dados do utilizador estão a ser carregados (ex: no carregamento inicial da página).
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [loading, setLoading] = useState(true);

    /**
     * Efeito que é executado apenas uma vez ao montar o componente.
     * Tenta obter os dados do utilizador logado do backend para manter a sessão.
     */
    useEffect(() => {
        /**
         * Função assíncrona para buscar os dados do utilizador logado a partir da API.
         * Atualiza o estado `user` e `loading` com base na resposta da API.
         */
        const fetchUser = async () => {
            try {
                let response = await api.get("/api/user/logged");
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Erro ao obter utilizador logado:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    /**
     * Função para lidar com o processo de login do utilizador.
     * Envia as credenciais para o backend e atualiza o estado do utilizador em caso de sucesso.
     * @param {string} username - O nome de utilizador para login.
     * @param {string} password - A senha para login.
     * @returns {Promise<boolean>} - True se o login for bem-sucedido, False caso contrário.
     */
    const login = async (username, password) => {
        try {
            const response = await api.post('/api/login', { username, password });
            if (response.data && response.data.user) {
                setUser(response.data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro no login:", error);
            return false;
        }
    };

    /**
     * Função para lidar com o processo de logout do utilizador.
     * Envia um pedido para o backend para invalidar a sessão e limpa o estado do utilizador no frontend.
     */
    const logout = async () => {
        try {
            await api.post("/api/logout");
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <UserContext.Provider value={ {user, setUser, loading, login, logout} }>
            {loading ? <div>Carregando...</div> : children}
        </UserContext.Provider>
    );
};

export default UserProvider;

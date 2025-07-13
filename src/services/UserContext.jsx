import { createContext, useContext, useEffect, useState } from "react";
import api from "./api.js"; // Certifique-se que este import aponta para a sua instância configurada do axios

// Cria o contexto do utilizador. O valor inicial é null.
const UserContext = createContext(null);

/**
 * Hook personalizado para consumir o contexto do utilizador.
 * Permite que qualquer componente filho aceda aos dados e funções fornecidas pelo UserProvider.
 * Mantém o nome `useUserContext` para compatibilidade com o código existente na Navbar.
 */
export const useUserContext = () => useContext(UserContext);

/**
 * Componente Provedor do Utilizador.
 * Responsável por gerir o estado global do utilizador (autenticado/não autenticado)
 * e por fornecer funções de login/logout aos seus componentes filhos.
 */
const UserProvider = ({ children }) => {
    // Estado para armazenar os dados do utilizador logado.
    // Espera-se que este objeto contenha propriedades como id, username, email, e role (ex: "USER", "ADMIN").
    const [user, setUser] = useState(null);

    // Estado para indicar se os dados do utilizador estão a ser carregados (ex: no carregamento inicial da página).
    const [loading, setLoading] = useState(true);

    /**
     * Efeito que é executado apenas uma vez ao montar o componente (equivalente a componentDidMount).
     * Tenta obter os dados do utilizador logado do backend para manter a sessão.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Tenta obter o utilizador logado do endpoint do backend.
                // A resposta esperada é o UserResponseDTO completo com o Role do utilizador.
                let response = await api.get("/api/user/logged");
                if (response.data) {
                    setUser(response.data); // Define os dados do utilizador no estado
                }
            } catch (error) {
                // Em caso de erro (ex: utilizador não autenticado, token expirado, erro de serialização do backend),
                // garante que o estado do utilizador é limpo.
                console.error('Erro ao obter utilizador logado:', error);
                setUser(null);
            } finally {
                // Marca o carregamento como concluído, independentemente do sucesso ou falha,
                // para que a aplicação possa renderizar o conteúdo.
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // O array vazio assegura que este efeito é executado apenas uma vez.

    /**
     * Função para lidar com o processo de login do utilizador.
     * Envia as credenciais para o backend e atualiza o estado do utilizador em caso de sucesso.
     * @param {string} username - O nome de utilizador para login.
     * @param {string} password - A senha para login.
     * @returns {Promise<boolean>} - True se o login for bem-sucedido, False caso contrário.
     */
    const login = async (username, password) => {
        try {
            // Envia as credenciais para o endpoint de login do backend.
            // Assume que o backend retorna um objeto com uma propriedade 'user'
            // que contém os dados completos do utilizador (incluindo o role).
            const response = await api.post('/api/login', { username, password });
            if (response.data && response.data.user) {
                setUser(response.data.user); // Atualiza o estado do utilizador no contexto
                return true; // Indica sucesso no login
            }
            return false; // Indica falha no login (sem dados de utilizador na resposta)
        } catch (error) {
            console.error("Erro no login:", error);
            // Poderá adicionar notificações ao utilizador aqui (ex: toast.error("Credenciais inválidas")).
            return false; // Indica falha no login devido a erro
        }
    };

    /**
     * Função para lidar com o processo de logout do utilizador.
     * Envia um pedido para o backend para invalidar a sessão e limpa o estado do utilizador no frontend.
     */
    const logout = async () => {
        try {
            // Envia um pedido POST para o endpoint de logout do Spring Security.
            // O endpoint de logout no Spring Security por padrão é POST /logout ou /api/logout.
            // Verifique a sua configuração em SecurityWebConfig.java para confirmar o endpoint exato.
            await api.post("/api/logout");
            // Limpa o estado do utilizador após o logout bem-sucedido.
            setUser(null);
            // Opcional: Pode redirecionar o utilizador para a homepage após o logout.
            // Por exemplo: navigate('/'); se estiver usando useNavigate em um componente.
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Aqui também pode integrar notificações de erro ao utilizador.
        }
    };

    return (
        // Fornece o objeto de utilizador, a função para definir o utilizador,
        // o estado de carregamento e as funções de login/logout aos componentes filhos.
        <UserContext.Provider value={ {user, setUser, loading, login, logout} }>
            {/* Enquanto o utilizador está a ser carregado, exibe uma mensagem de "Carregando...".
                Após o carregamento (sucesso ou falha), renderiza os componentes filhos. */}
            {loading ? <div>Carregando...</div> : children}
        </UserContext.Provider>
    );
};

export default UserProvider;
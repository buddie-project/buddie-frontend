import axios from 'axios';
import { toast } from 'react-toastify'; // Importar toast para notificações
// Importar useUserContext para aceder ao contexto do utilizador no interceptor
// Nota: Este import é um truque para evitar dependências cíclicas em alguns bundlers.
// Em um projeto maior, você pode usar uma solução de inversão de controlo ou um router history object.
let userContextRef = null;
export const setUserContextRef = (ref) => {
    userContextRef = ref;
};

const api = axios.create({
    // URL base da nossa API Spring Boot
    baseURL: 'http://localhost:8080',
    // Envia os cookies de sessão em cada requisição
    withCredentials: true
});

// NOVO: Adicionar um interceptor de resposta global
api.interceptors.response.use(
    response => response, // Se a resposta for bem-sucedida, apenas a devolve
    async error => {
        // Se a resposta de erro tiver um status 401 (Unauthorized) ou 403 (Forbidden)
        // e não for a rota de login ou logout (para evitar loops)
        if (error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !error.config.url.includes('/api/login') &&
            !error.config.url.includes('/api/logout')) {

            console.error("Intercepted 401/403. Session might be invalid or unauthorized access attempt.", error.response);
            toast.error("Sessão expirada ou acesso não autorizado. Por favor, faça login novamente.", { theme: "colored" });

            // Se o UserContext estiver disponível (através da ref)
            if (userContextRef && userContextRef.current) {
                userContextRef.current.logout(); // Chama a função de logout do UserContext
                userContextRef.current.navigate('/entrar'); // Redireciona para a página de login
            }
        }
        return Promise.reject(error); // Rejeita a promise de erro para que os blocos .catch() continuem a funcionar
    }
);

export default api;
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Referência mutável para o objeto de contexto do utilizador.
 * Usado para permitir que o interceptor de Axios aceda a funções do contexto (como logout e navigate)
 * sem criar dependências cíclicas.
 * @type {object|null}
 */
let userContextRef = null;

/**
 * Define a referência para o objeto de contexto do utilizador.
 * Esta função é chamada a partir do componente `App.jsx` para inicializar a referência.
 * @param {object} ref - O objeto de referência que contém o contexto do utilizador e a função de navegação.
 */
export const setUserContextRef = (ref) => {
    userContextRef = ref;
};

/**
 * Instância configurada do Axios para fazer requisições HTTP.
 * Define a URL base e configura o envio de credenciais (cookies de sessão).
 */
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

/**
 * Interceptor de resposta global para o Axios.
 * Interceta respostas de erro para lidar com autenticação e autorização (401/403).
 * Se detetar uma sessão inválida ou acesso não autorizado, exibe uma notificação,
 * chama a função de logout do contexto do utilizador e redireciona para a página de login.
 */
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !error.config.url.includes('/api/login') &&
            !error.config.url.includes('/api/logout')) {

            console.error("Intercepted 401/403. Session might be invalid or unauthorized access attempt.", error.response);
            toast.error("Sessão expirada ou acesso não autorizado. Por favor, faça login novamente.", { theme: "colored" });

            if (userContextRef && userContextRef.current) {
                userContextRef.current.logout();
                userContextRef.current.navigate('/entrar');
            }
        }
        return Promise.reject(error);
    }
);

export default api;

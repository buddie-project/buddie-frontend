import './style/App.css';
import "../public/icons/css/icons.css";
import "./style/Homepage.css";

import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from 'react';

// Imports de componentes de Páginas
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";
import About from "./pages/About.jsx";
import Faqs from "./pages/Faqs.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import InstitutionDetails from "./pages/InstitutionDetails.jsx";

// Imports de componentes de Layout e Páginas de Perfil
import ProfileLayout from "./pages/profilePages/ProfileLayout.jsx";
import Profile from "./components/profilePages/Profile.jsx";
import Favorites from "./pages/profilePages/Favorites.jsx";
import Bookmarks from "./pages/profilePages/Bookmarks.jsx";
import Notifications from "./pages/profilePages/Notifications.jsx";
import Interactions from "./pages/profilePages/Interactions.jsx";
import Calendar from "./pages/profilePages/Calendar.jsx";
import Configurations from "./pages/profilePages/Configurations.jsx";
import AdminPage from "./components/profilePages/AdminPage.jsx";

// Imports de componentes gerais
import Navbar from "./components/generalComponents/Navbar.jsx";
import Footer from "./components/generalComponents/Footer.jsx";

// Importar o UserProvider (provedor do contexto do utilizador) e setUserContextRef
import UserProvider, { useUserContext } from "./services/UserContext.jsx";
import { setUserContextRef } from "./services/api.js";

// Importar o ProtectedRoute (componente de proteção de rotas)
import ProtectedRoute from './routes/ProtectedRoute';

/**
 * Componente principal da aplicação.
 * Configura as rotas da aplicação, gerencia o estado global do utilizador através do UserContext,
 * e controla a renderização condicional da Navbar e do Footer.
 * @returns {JSX.Element} O componente App.
 */
function App() {
    /**
     * Hook para obter o objeto de localização atual, usado para determinar a rota.
     * @type {import('react-router-dom').Location}
     */
    const location = useLocation();
    /**
     * Hook para navegação programática.
     * @type {import('react-router-dom').NavigateFunction}
     */
    const navigate = useNavigate();
    /**
     * Objeto de contexto do utilizador obtido via hook `useUserContext`.
     * Contém o estado do utilizador e funções de autenticação.
     * @type {object}
     */
    const userContext = useUserContext();
    /**
     * Referência mutável para o objeto de contexto do utilizador e a função `navigate`.
     * Usada para permitir que o interceptor de Axios aceda a estas funções.
     * @type {React.MutableRefObject<object|null>}
     */
    const userContextRef = useRef(null);

    /**
     * Efeito para inicializar a referência do contexto do utilizador e da função de navegação.
     * Esta referência é passada para o serviço `api.js` para ser usada nos interceptores.
     * É executado a cada renderização se `userContext` ou `navigate` mudarem.
     */
    useEffect(() => {
        userContextRef.current = { ...userContext, navigate };
        setUserContextRef(userContextRef);
    }, [userContext, navigate]);

    /**
     * Verifica se a rota atual é a página inicial.
     * @type {boolean}
     */
    const isHomePage = location.pathname === '/';
    /**
     * Verifica se a rota atual é uma página de perfil (inclui sub-rotas).
     * @type {boolean}
     */
    const isProfilePage = location.pathname.startsWith('/perfil');
    /**
     * Verifica se a rota atual é a página de administração.
     * @type {boolean}
     */
    const isAdminPage = location.pathname.startsWith('/admin');
    /**
     * Verifica se a rota atual é a página de login.
     * @type {boolean}
     */
    const isLoginPage = location.pathname === '/entrar';
    /**
     * Verifica se a rota atual é a página de registo.
     * @type {boolean}
     */
    const isRegisterPage = location.pathname === '/registar';
    /**
     * Verifica se a rota atual é a página de FAQs.
     * @type {boolean}
     */
    const isFaqsPage = location.pathname === '/faqs';
    /**
     * Verifica se a rota atual é uma página de detalhes de instituição.
     * @type {boolean}
     */
    const isInstitutionDetails = location.pathname.startsWith('/instituicao');

    return (
        <>
            {/* O UserProvider envolve toda a aplicação para que o contexto do utilizador esteja disponível para todos os componentes. */}
            <UserProvider>
                {/* A Navbar é renderizada em todas as páginas. */}
                <Navbar/>
                {/* As Rotas definem a navegação da aplicação. */}
                <Routes>
                    {/* Rotas Públicas: Acessíveis a todos os utilizadores. */}
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/sobre" element={<About/>}/>
                    <Route path="/cursos" element={<Courses/>}/>
                    <Route path="/cursos/:courseId" element={<CourseDetails/>}/>
                    <Route path="/instituicao/:id" element={<InstitutionDetails/>}/>
                    <Route path="/entrar" element={<SignIn/>}/>
                    <Route path="/registar" element={<SignUp/>}/>
                    <Route path="/faqs" element={<Faqs/>}/>

                    {/* Rotas Protegidas para Utilizadores Autenticados (USER e ADMIN).
                        Qualquer utilizador autenticado pode aceder a estas rotas de perfil. */}
                    <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
                        <Route path="/perfil" element={<ProfileLayout />}>
                            {/* Redireciona a rota base /perfil para /perfil/conta */}
                            <Route index element={<Navigate to="conta" />} />
                            <Route path="conta" element={<Profile />} />
                            <Route path="configuracoes" element={<Configurations />} />
                            <Route path="favoritos" element={<Favorites />} />
                            <Route path="ver-mais-tarde" element={<Bookmarks />} />
                            <Route path="notificacoes" element={<Notifications />} />
                            <Route path="interacoes" element={<Interactions />} />
                            <Route path="calendario" element={<Calendar />} />
                        </Route>
                    </Route>

                    {/* Rota Protegida para a Área de Administração (APENAS ADMIN).
                        Esta rota de nível superior é protegida pelo ProtectedRoute. */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<AdminPage/>}/>
                    </Route>

                    {/* Rota Opcional para Acesso Negado:
                        Exibida caso um utilizador sem permissão tente aceder a uma rota protegida. */}
                    <Route path="/acesso-negado" element={<div>Acesso Negado. Você não tem permissão para ver esta página.</div>} />

                </Routes>
            </UserProvider>
            {/* Lógica de Renderização Condicional do Footer:
                O Footer é exibido APENAS se a rota atual não for uma das páginas listadas. */}
            {!isHomePage && !isProfilePage && !isAdminPage && !isInstitutionDetails && !isLoginPage && !isRegisterPage && !isFaqsPage && <Footer/>}
        </>
    );
}

export default App;
import './style/App.css';
import "../public/icons/css/icons.css";
import "./style/Homepage.css";

import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import { useEffect, useRef } from 'react'; // Importar useRef e useEffect

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
import Profile from "./components/profilePages/Profile.jsx"; // Página "Conta"
import Favorites from "./pages/profilePages/Favorites.jsx";
import Bookmarks from "./pages/profilePages/Bookmarks.jsx";
import Notifications from "./pages/profilePages/Notifications.jsx";
import Interactions from "./pages/profilePages/Interactions.jsx";
import Calendar from "./pages/profilePages/Calendar.jsx";
import Configurations from "./pages/profilePages/Configurations.jsx";
import AdminPage from "./components/profilePages/AdminPage.jsx"; // Página de Admin

// Imports de componentes gerais (Navbar, Footer)
import Navbar from "./components/generalComponents/Navbar.jsx";
import Footer from "./components/generalComponents/Footer.jsx";

// Importar o UserProvider (provedor do contexto do utilizador) e setUserContextRef
import UserProvider, { useUserContext } from "./services/UserContext.jsx";
import { setUserContextRef } from "./services/api.js"; // NOVO: Importar a função para definir a ref

// Importar o ProtectedRoute (componente de proteção de rotas)
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    const location = useLocation();
    const navigate = useNavigate(); // Obter a função navigate
    const userContext = useUserContext(); // Obter o objeto do contexto
    const userContextRef = useRef(null);

    // NOVO: Usar useEffect para inicializar a referência do contexto
    useEffect(() => {
        // A cada renderização, atualiza a referência para o objeto de contexto atual e a função navigate
        userContextRef.current = { ...userContext, navigate };
        setUserContextRef(userContextRef);
    }, [userContext, navigate]); // Depende do userContext e navigate

    // Lógica para renderização condicional do Footer (mantida a sua lógica original)
    const isHomePage = location.pathname === '/';
    const isProfilePage = location.pathname.startsWith('/perfil'); // Inclui todas as sub-rotas de perfil
    const isAdminPage = location.pathname.startsWith('/admin'); // Flag para a rota de admin
   /* const isAboutPage = location.pathname === '/sobre';
    const isCoursesPage = location.pathname === '/cursos' || location.pathname.startsWith('/cursos/'); // Inclui detalhes do curso
*/
    return (
        <>
            {/* O UserProvider deve envolver toda a aplicação para que o contexto do utilizador esteja disponível */}
            <UserProvider>
                <Navbar/> {/* A Navbar também precisa de acesso ao contexto do utilizador */}
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/sobre" element={<About/>}/>
                    <Route path="/cursos" element={<Courses/>}/>
                    {/* Ajuste o parâmetro para ':courseId' para consistência com o CourseDetails.jsx */}
                    <Route path="/cursos/:courseId" element={<CourseDetails/>}/>
                    <Route path="/instituicao/:id" element={<InstitutionDetails/>}/>
                    <Route path="/entrar" element={<SignIn/>}/>
                    <Route path="/registar" element={<SignUp/>}/>
                    <Route path="/faqs" element={<Faqs/>}/>

                    {/*
                    Rotas Protegidas para Utilizadores Autenticados (USER e ADMIN)
                    Qualquer utilizador autenticado pode aceder a estas rotas de perfil.
                    */}
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

                    {/*
                    Rota Protegida para a Área de Administração (APENAS ADMIN)
                    Mantida como rota de nível superior (/admin) conforme o seu código original,
                    mas agora protegida pelo ProtectedRoute.
                    */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<AdminPage/>}/>
                    </Route>

                    {/* Opcional: Rota para Acesso Negado (caso um utilizador sem permissão tente aceder a uma rota protegida) */}
                    <Route path="/acesso-negado" element={<div>Acesso Negado. Você não tem permissão para ver esta página.</div>} />

                </Routes>
            </UserProvider>
            {/* Lógica do Footer: Exibe o footer APENAS se não estiver nas páginas listadas */}
            {!isHomePage && !isProfilePage && !isAdminPage && <Footer/>}
        </>
    )
}

export default App;
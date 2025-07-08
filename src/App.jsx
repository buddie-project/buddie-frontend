import './style/App.css';
import "../public/icons/css/icons.css";
import "./style/Homepage.css"
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";
import Navbar from "./components/generalComponents/Navbar.jsx";
import Footer from "./components/generalComponents/Footer.jsx";
import UserProvider from "./services/UserContext.jsx";
import About from "./pages/About.jsx";
import Faqs from "./pages/Faqs.jsx";
import Courses from "./pages/Courses.jsx";
import Favorites from "./pages/profilePages/Favorites.jsx";
import Bookmarks from "./pages/profilePages/Bookmarks.jsx";
import Notifications from "./pages/profilePages/Notifications.jsx";
import Interactions from "./pages/profilePages/Interactions.jsx";
import Calendar from "./pages/profilePages/Calendar.jsx";
import Configurations from "./pages/profilePages/Configurations.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import AdminPage from "./components/profilePages/AdminPage.jsx";
import InstitutionDetails from "./pages/InstitutionDetails.jsx";
import ProfileLayout from "./pages/profilePages/ProfileLayout.jsx";
import Profile from "./components/profilePages/Profile.jsx";

function App() {

    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isProfilePage = location.pathname.startsWith('/perfil') || location.pathname.startsWith('/admin');
    const isAboutPage = location.pathname === '/sobre';
    const isCoursesPage = location.pathname === '/cursos';

    return (
        <>
            <UserProvider>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/sobre" element={<About/>}/>
                    <Route path="/cursos" element={<Courses/>}/>
                    <Route path="/cursos/:id" element={<CourseDetails/>}/>
                    <Route path="/instituicao/:id" element={<InstitutionDetails/>}/>
                    <Route path="/entrar" element={<SignIn/>}/>
                    <Route path="/registar" element={<SignUp/>}/>
                    <Route path="/faqs" element={<Faqs/>}/>

                    <Route path="/perfil" element={<ProfileLayout />}>

                    <Route index element={<Navigate to="conta" />} />
                    <Route path="conta" element={<Profile />} />
                    <Route path="configuracoes" element={<Configurations />} />
                    <Route path="favoritos" element={<Favorites />} />
                    <Route path="ver-mais-tarde" element={<Bookmarks />} />
                    <Route path="notificacoes" element={<Notifications />} />
                    <Route path="interacoes" element={<Interactions />} />
                    <Route path="calendario" element={<Calendar />} />
                    </Route>

                    <Route path="/admin" element={<AdminPage/>}>
                    <Route index element={<Navigate to="admin" />} />
                    </Route>

                </Routes>
            </UserProvider>
            {!isHomePage && !isProfilePage && !isAboutPage && !isCoursesPage && <Footer/>}
        </>
    )
}

export default App
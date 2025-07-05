import './style/App.css';
import "../public/icons/css/icons.css";
import "./style/Homepage.css"
import {Route, Routes, useLocation} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";
import Navbar from "./components/generalComponents/Navbar.jsx";
import Footer from "./components/generalComponents/Footer.jsx";
import UserProvider from "./services/UserContext.jsx";
import About from "./pages/About.jsx";
import Faqs from "./pages/Faqs.jsx";
import Courses from "./pages/Courses.jsx";
import ProfilePage from "./pages/profilePages/ProfilePage.jsx";
import Favorites from "./pages/profilePages/Favorites.jsx";
import Bookmarks from "./pages/profilePages/Bookmarks.jsx";
import Notifications from "./pages/profilePages/Notifications.jsx";
import Interactions from "./pages/profilePages/Interactions.jsx";
import Calendar from "./pages/profilePages/Calendar.jsx";
import Configurations from "./pages/profilePages/Configurations.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {

    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isProfilePage = location.pathname.startsWith('/area-pessoal');
    const isAboutPage = location.pathname === '/sobre';
    const isCoursesPage = location.pathname === '/cursos';

    return (
      <>
        <Navbar />
         <UserProvider>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/sobre" element={<About/>}/>
                <Route path="/cursos" element={<Courses/>}/>
                <Route path="/entrar" element={<SignIn/>}/>
                <Route path="/registar" element={<SignUp/>}/>
                <Route path="/faqs" element={<Faqs/>}/>
                <Route path="/area-pessoal/conta" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
                <Route path="/area-pessoal/favoritos" element={<ProtectedRoute><Favorites/></ProtectedRoute>}/>
                <Route path="/area-pessoal/ver-mais-tarde" element={<ProtectedRoute><Bookmarks/></ProtectedRoute>}/>
                <Route path="/area-pessoal/notificacoes" element={<ProtectedRoute><Notifications/></ProtectedRoute>}/>
                <Route path="/area-pessoal/interacoes" element={<ProtectedRoute><Interactions/></ProtectedRoute>}/>
                <Route path="/area-pessoal/calendario" element={<ProtectedRoute><Calendar/></ProtectedRoute>}/>
                <Route path="/area-pessoal/configuracoes" element={<ProtectedRoute><Configurations/></ProtectedRoute>}/>
            </Routes>
          </UserProvider>
          {!isHomePage && !isProfilePage && !isAboutPage && !isCoursesPage && <Footer />}
      </>
  )
}

export default App
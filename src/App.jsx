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

function App() {

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
      <>
        <Navbar />
         <UserProvider>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/sobre" element={<About/>}/>
                <Route path="/entrar" element={<SignIn/>}/>
                <Route path="/registar" element={<SignUp/>}/>
            </Routes>
          </UserProvider>
          {!isHomePage && <Footer />}
      </>
  )
}

export default App
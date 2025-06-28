import './style/Login.css'
import './style/App.css';
import "../public/icons/css/icons.css";
import {Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";
import Navbar from "./components/generalComponents/Navbar.jsx";
import Footer from "./components/generalComponents/Footer.jsx";
import UserProvider from "./services/UserContext.jsx";

function App() {

  return (
      <>
        <Navbar />
          <UserProvider>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/registar" element={<SignUp/>}/>
                <Route path="/entrar" element={<SignIn/>}/>
            </Routes>
          </UserProvider>
        <Footer />
      </>
  )
}

export default App
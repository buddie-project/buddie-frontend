import './style/Login.css'
import '../public/icons/css/icons.css';
import {Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Homepage from "./pages/Homepage.jsx";

function App() {

  return (
    <>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/registar" element={<SignUp/>}/>
                <Route path="/entrar" element={<SignIn/>}/>
            </Routes>
    </>
  )
}

export default App
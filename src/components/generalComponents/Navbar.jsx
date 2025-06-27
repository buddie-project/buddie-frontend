import {Link} from "react-router-dom";
import {useState} from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="nav">
            <div className="nav-logo">
                <Link to="/">
                    <img src="/images/buddie-logo.png" alt="Logo" className="logo" />
                </Link>
            </div>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
            >
                ...
            </button>

            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>homepage</Link>
                <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>sobre</Link>
                <Link to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>cursos</Link>
                <Link to="/entrar" className="nav-link" onClick={() => setMenuOpen(false)}>iniciar sessão</Link>
                <Link to="/registar" className="nav-link" onClick={() => setMenuOpen(false)}>registar</Link>
            </div>
        </nav>
    )
}

export default Navbar;
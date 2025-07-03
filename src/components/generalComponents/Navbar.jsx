import {Link, NavLink} from "react-router-dom";
import {useState} from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearchToggle = () => {
        setSearchOpen(!searchOpen);
        };

    return (
        <nav className="nav">
            <div className="nav-logo">
                <Link to="/">
                    <img src="/images/buddie-logo.png" alt="Logo" className="logo" />
                </Link>
            </div>

            <h2
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="open menu"
            >
                menu
            </h2>

            <div className={`nav-links ${menuOpen ? "open" : ""} ${searchOpen ? "search-open" : ""}`}>
                <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>página inicial</Link>
                <NavLink to="/sobre" className="nav-link" onClick={() => setMenuOpen(false)}>sobre</NavLink>
                <NavLink to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>cursos</NavLink>
                <NavLink to="/entrar" className="nav-link" onClick={() => setMenuOpen(false)}>iniciar sessão</NavLink>
                <NavLink to="/faqs" className="nav-link" onClick={() => setMenuOpen(false)}>faqs</NavLink>
                <i className="icon-search" onClick={handleSearchToggle} aria-hidden="true"></i>
                { searchOpen && <input type="text" className="search-input" placeholder="Pesquisar..." />}
            </div>
        </nav>
    )
}

export default Navbar;
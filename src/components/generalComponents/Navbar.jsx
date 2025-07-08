import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../../services/UserContext.jsx";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const context = useUserContext();

    const navigate = useNavigate();

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
                <NavLink to="/faqs" className="nav-link" onClick={() => setMenuOpen(false)}>faqs</NavLink>

                {!context?.user && (
                    <>
                        <NavLink to="/entrar" className="nav-link" onClick={() => setMenuOpen(false)}>iniciar sessão</NavLink>
                    </>
                )}

                {context?.user && (
                    <>
                        <div className="user-dropdown">
                            <NavLink to="/perfil" className="nav-link" onClick={() => setMenuOpen(false)}>{context.user.username}</NavLink>
                            <div className="dropdown-content">
                                <button
                                    onClick={() => {
                                        navigate("/perfil");
                                    }}>
                                    Conta
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/perfil/configuracoes");
                                    }}>
                                    Configurações
                                </button>
                                <button
                                    onClick={() => {
                                        context.logout();
                                        navigate("/");
                                    }}>
                                    Terminar Sessão
                                </button>
                            </div>
                        </div>
                    </>
                )}
                <i className="icon-search" onClick={handleSearchToggle} aria-hidden="true"></i>
                {searchOpen && <input type="text" className="search-input" placeholder="Pesquisar..." />}
            </div>
        </nav>
    );
}

export default Navbar;


import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserContext } from "../../services/UserContext.jsx";

/**
 * @typedef {object} UserContextObject
 * @property {object|null} user - O objeto do utilizador autenticado, ou `null`.
 * @property {function(): Promise<void>} logout - Função para terminar a sessão do utilizador.
 */

/**
 * @typedef {function(...*): void} NavigateFunction
 * Representa a função de navegação do React Router DOM.
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */

/**
 * Componente Navbar.
 * Representa a barra de navegação principal da aplicação.
 * Gere a abertura/fecho do menu móvel, a visibilidade da barra de pesquisa,
 * e a alteração de estilo ao fazer scroll.
 * Exibe links de navegação e controlo de autenticação/perfil do utilizador.
 * @returns {JSX.Element} O componente Navbar.
 */
function Navbar() {
    /**
     * Estado para controlar a abertura/fecho do menu de navegação móvel.
     * @type {boolean}
     */
    const [menuOpen, setMenuOpen] = useState(false);
    /**
     * Estado para controlar a visibilidade da barra de pesquisa.
     * @type {boolean}
     */
    const [searchOpen, setSearchOpen] = useState(false);
    /**
     * Estado para controlar se a página foi scrollada (para aplicar estilos diferentes).
     * @type {boolean}
     */
    const [scrolled, setScrolled] = useState(false);
    /**
     * Hook para aceder ao contexto do utilizador, contendo informações do utilizador logado e a função de logout.
     * @type {UserContextObject}
     */
    const { user, logout } = useUserContext();
    /**
     * Hook para navegação programática.
     * @type {NavigateFunction}
     */
    const navigate = useNavigate();

    /**
     * Função para alternar a visibilidade da barra de pesquisa.
     */
    const handleSearchToggle = () => {
        setSearchOpen(!searchOpen);
    };

    /**
     * Função para lidar com o processo de logout do utilizador.
     * Chama a função de logout do contexto do utilizador, redireciona para a página inicial
     * e fecha o menu móvel.
     */
    const handleLogout = async () => {
        await logout();
        navigate("/");
        setMenuOpen(false);
    };

    /**
     * Efeito para adicionar e remover a classe 'scrolled' da barra de navegação
     * com base na posição do scroll da janela.
     */
    useEffect(() => {
        /**
         * Lida com o evento de scroll da janela, atualizando o estado `scrolled`.
         * @param {Event} event - O evento de scroll.
         */
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-logo">
                <Link to="/">
                    <img src="/images/buddie-logo.png" alt="Logo" className="logo" />
                </Link>
            </div>

            <h2
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="abrir menu"
            >
                menu
            </h2>

            <div className={`nav-links ${menuOpen ? "open" : ""} ${searchOpen ? "search-open" : ""}`}>
                <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>página inicial</NavLink>
                <NavLink to="/sobre" className="nav-link" onClick={() => setMenuOpen(false)}>sobre</NavLink>
                <NavLink to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>cursos</NavLink>
                <NavLink to="/faqs" className="nav-link" onClick={() => setMenuOpen(false)}>faqs</NavLink>

                {user ? (
                    <div className="user-dropdown">
                        <NavLink to="/perfil/conta" className="nav-link" onClick={() => setMenuOpen(false)}>
                            {user.username}
                        </NavLink>
                        <div className="dropdown-content">
                            {user.role === 'ADMIN' && (
                                <button onClick={() => { navigate("/admin"); setMenuOpen(false); }}>Gerir Plataforma</button>
                            )}
                            <button onClick={() => { navigate("/perfil/conta"); setMenuOpen(false); }}>Conta</button>
                            <button onClick={() => { navigate("/perfil/configuracoes"); setMenuOpen(false); }}>Configurações</button>
                            <button onClick={handleLogout}>Terminar Sessão</button>
                        </div>
                    </div>
                ) : (
                    <NavLink to="/entrar" className="nav-link" onClick={() => setMenuOpen(false)}>iniciar sessão</NavLink>
                )}
                <i className="icon-search" onClick={handleSearchToggle} aria-hidden="true"></i>
                {searchOpen && <input type="text" className="search-input" placeholder="Pesquisar..." />}
            </div>
        </nav>
    );
}

export default Navbar;
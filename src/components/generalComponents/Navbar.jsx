import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserContext } from "../../services/UserContext.jsx";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // Usar o hook useUserContext para aceder ao contexto do utilizador
    const { user, logout } = useUserContext(); // Desestruturar user e logout do contexto
    const navigate = useNavigate();

    // Função para alternar a visibilidade da barra de pesquisa
    const handleSearchToggle = () => {
        setSearchOpen(!searchOpen);
    };

    // Função para lidar com o logout do utilizador
    const handleLogout = async () => {
        await logout(); // Chama a função de logout do contexto
        navigate("/"); // Redireciona para a página inicial após o logout
        setMenuOpen(false); // Fecha o menu móvel (se aberto) após o logout
    };

    // Efeito para adicionar/remover a classe 'scrolled' com base na posição do scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); // Adiciona 'scrolled' se o scroll for maior que 50px
        };

        window.addEventListener('scroll', handleScroll);
        // Função de limpeza para remover o event listener quando o componente é desmontado
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Executa apenas uma vez ao montar/desmontar o componente

    return (
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-logo">
                <Link to="/">
                    <img src="/images/buddie-logo.png" alt="Logo" className="logo" />
                </Link>
            </div>

            {/* Botão para alternar a visibilidade do menu móvel */}
            <h2
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="abrir menu" // Ajuste de acessibilidade
            >
                menu
            </h2>

            {/* Links de Navegação */}
            <div className={`nav-links ${menuOpen ? "open" : ""} ${searchOpen ? "search-open" : ""}`}>
                <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>página inicial</NavLink>
                <NavLink to="/sobre" className="nav-link" onClick={() => setMenuOpen(false)}>sobre</NavLink>
                <NavLink to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>cursos</NavLink>
                <NavLink to="/faqs" className="nav-link" onClick={() => setMenuOpen(false)}>faqs</NavLink>

                {user ? ( // Renderização condicional: se o utilizador estiver logado
                    <div className="user-dropdown">
                        {/* Link principal para o perfil, exibindo o username */}
                        <NavLink to="/perfil/conta" className="nav-link" onClick={() => setMenuOpen(false)}>
                            {user.username} {/* Aceder ao username do objeto user do contexto */}
                        </NavLink>
                        <div className="dropdown-content">
                            {/* Link para a área de administração, visível APENAS para utilizadores com role "ADMIN" */}
                            {user.role === 'ADMIN' && (
                                <button onClick={() => { navigate("/admin"); setMenuOpen(false); }}>Gerir Plataforma</button>
                            )}
                            {/* Link para a área de conta (perfil base), acessível a todos os utilizadores logados */}
                            <button onClick={() => { navigate("/perfil/conta"); setMenuOpen(false); }}>Conta</button>
                            <button onClick={() => { navigate("/perfil/configuracoes"); setMenuOpen(false); }}>Configurações</button>
                            {/* Botão para terminar a sessão */}
                            <button onClick={handleLogout}>Terminar Sessão</button>
                        </div>
                    </div>
                ) : ( // Renderização condicional: se o utilizador NÃO estiver logado
                    <NavLink to="/entrar" className="nav-link" onClick={() => setMenuOpen(false)}>iniciar sessão</NavLink>
                )}
                {/* Ícone e input de pesquisa, mantidos como no seu código original */}
                <i className="icon-search" onClick={handleSearchToggle} aria-hidden="true"></i>
                {searchOpen && <input type="text" className="search-input" placeholder="Pesquisar..." />}
            </div>
        </nav>
    );
}

export default Navbar;
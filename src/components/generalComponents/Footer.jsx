import React from "react";

/**
 * Componente Footer.
 * Representa o rodapé da aplicação, exibindo informações de copyright
 * e um link para o repositório do projeto no GitHub.
 * @returns {JSX.Element} O componente Footer.
 */
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <a href="https://github.com/buddie-project"
                   target="_blank"
                   rel="noreferrer"
                   className="github-link">
                    <img src="/images/github-mark.svg" className="github-icon" alt="Github Logo" />
                </a>
                <p>
                    | &copy; {new Date().getFullYear()} Buddie. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer;
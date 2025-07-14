import React from "react";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">

                <p>
                <a href="https://github.com/buddie-project"
                   target="_blank"
                   rel="noreferrer"
                   className="github-link">
                    {/*<i className="icon-github" aria-hidden="true" style={{color: "black", width: "32", height: "auto"}} />*/}
                    <img src="/images/github-mark.svg" className="github-icon" width="32" height="auto" alt="Github Logo" />
                </a>

                    | &copy; {new Date().getFullYear()} Buddie. All rights reserved.
                </p>

            </div>
        </footer>
    )
}

export default Footer;
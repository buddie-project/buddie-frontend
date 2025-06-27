import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <Link to="/" className="footer-link">homepage</Link>

                <p>&copy; {new Date().getFullYear()} Buddie. All rights reserved. </p>

            </div>

        </footer>
    )
}

export default Footer;
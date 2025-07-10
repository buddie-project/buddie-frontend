import "../style/Homepage.css"
import {Link} from "react-router-dom";

function Homepage() {

    return (
        <>
            <section className="homepage-hero" id="homepage">
                <div className="background-homepage"></div>
                <div className="map-container">
                    <div className="map">
                        <Link to="/cursos?filtro=artes" className="area arts">artes</Link>
                        <Link to="/cursos?filtro=inglês" className="area english">inglês</Link>
                        <Link to="/cursos?filtro=português" className="area portuguese">português</Link>
                        <Link to="/cursos?filtro=geometria" className="area geometry">geometria</Link>
                        <Link to="/cursos?filtro=design" className="area design">design</Link>
                        <Link to="/cursos?filtro=arquitetura" className="area architecture">arquitetura</Link>
                        <Link to="/cursos?filtro=matemática" className="area math">matemática</Link>
                        <Link to="/cursos?filtro=filosofia" className="area philosophy">filosofia</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Homepage;
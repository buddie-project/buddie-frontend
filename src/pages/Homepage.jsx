import "../style/Homepage.css"
import {Link} from "react-router-dom";

function Homepage() {

    return (
        <>
            <section className="homepage-hero" id="homepage">
                <div className="background-homepage"></div>
                <div className="map-container">
                    <div className="map">
                        <Link to="/cursos?area=artes" className="area arts">artes</Link>
                        <Link to="/cursos?area=inglês" className="area english">inglês</Link>
                        <Link to="/cursos?area=português" className="area portuguese">português</Link>
                        <Link to="/cursos?area=geometria" className="area geometry">geometria</Link>
                        <Link to="/cursos?area=design" className="area design">design</Link>
                        <Link to="/cursos?area=arquitetura" className="area architecture">arquitetura</Link>
                        <Link to="/cursos?area=matemática" className="area math">matemática</Link>
                        <Link to="/cursos?area=filosofia" className="area philosophy">filosofia</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Homepage;
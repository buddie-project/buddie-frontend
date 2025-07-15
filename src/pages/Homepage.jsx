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
                        <Link to="/cursos?area=direito" className="area law">direito</Link>
                        <Link to="/cursos?area=psicologia" className="area psychology">psicologia</Link>
                        <Link to="/cursos?area=informática" className="area tech">informática</Link>
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
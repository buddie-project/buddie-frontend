import "../style/Homepage.css"

function Homepage() {
    return (
        <>
            <section className="homepage-hero" id="homepage">
                <div className="background-homepage"></div>
                <div className="map-container">
                    <div className="map">
                        <span className="area arts">artes</span>
                        <span className="area english">inglês</span>
                        <span className="area portuguese">português</span>
                        <span className="area geometry">geometria</span>
                        <span className="area design">design</span>
                        <span className="area architecture">arquitetura</span>
                        <span className="area math">matemática</span>
                        <span className="area philosophy">filosofia</span>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Homepage;
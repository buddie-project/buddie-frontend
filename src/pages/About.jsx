import "../style/About.css";
import "../style/App.css";
import { useEffect } from "react";

function About() {

    useEffect(() => {
        const scrollDownButton = document.getElementById('scroll-down');
        if (!scrollDownButton) return;

        const handleClick = () => {
            const targetPosition = window.innerHeight;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1500;
            let start = null;

            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percent = Math.min(progress / duration, 1);
                window.scrollTo(0, startPosition + distance * easeInOutQuad(percent));
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }

            window.requestAnimationFrame(step);
        };

        scrollDownButton.addEventListener('click', handleClick);

        return () => scrollDownButton.removeEventListener('click', handleClick);
    }, []);

    return (
        <>
            <section className="about-hero" id="about">
                <div className="background-about"></div>
                <div className="about">
                    <span className="age">+23?</span>
                    <span className="what-now">E agora?</span>
                </div>
                <div className="scroll-down" id="scroll-down">
                    <i className="icon-down-arrow" aria-hidden="true"></i>
                </div>
            </section>

            <section className="about-section">
                <h2>Quem somos?</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse blandit lobortis magna in eleifend. Vestibulum leo sem, pharetra at tempor quis, maximus at odio. Cras iaculis facilisis massa mollis luctus. Nam a blandit sem. Nam id tincidunt nisl. Praesent ut faucibus libero. Donec imperdiet magna ut orci iaculis, at porta neque hendrerit. Aliquam malesuada semper metus, eu auctor tortor ultrices nec. Quisque mollis pulvinar cursus. Fusce dictum euismod lectus. Nullam sagittis purus et aliquam scelerisque. Etiam dignissim dui vel dictum semper. Sed ullamcorper, quam eu hendrerit hendrerit, ipsum leo placerat urna, euismod egestas sem nunc nec lectus. Nulla finibus volutpat lacinia. Mauris nibh enim, rutrum ac commodo in, fringilla eu elit. Aenean maximus ante id velit tempor, et tincidunt nisi facilisis.
                </p>

                <div className="about-cards">
                    <div className="card">
                        <img src="/images/buddie-logo-wht.png" alt="team" />
                    </div>
                    <div className="card">
                        <h3>Encontra-nos</h3>
                        <p>Github</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default About;

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
                <section className="section-text">
                <h2>Quem somos?</h2>
                <p>
                    O Buddie é um companheiro para todos os estudantes que pretendam ingressar no ensino superior através do regime +23.

                    Voltar a estudar pode ser um processo desafiante e, por vezes, solitário. Requer que o estudante esteja atento e a par de todo o processo burocrático de candidatura, entrevista e ingresso numa instituição de ensino superior.

                    Foi para colmatar as dificuldades deste processo que surgiu o Buddie.

                    Nesta plataforma, os estudantes +23 encontram toda a informação relativa aos cursos e instituições de ensino superior onde pretendam ingressar, bem como todo o processo de candidatura. Além disso, poderão ter acesso aos requisitos de qualquer curso de ensino superior com regime +23 anos, em instituições nacionais.

                    Para os futuros estudantes que ainda estejam a explorar opções, o Buddie  permite conhecer todos os cursos por área científica e de formação com base na lista oficial da DGES.

                    Se já decidiste que queres voltar a estudar, ou se ainda estás a ponderar essa possibilidade, o Buddie está aqui para garantir que tomas uma decisão informada e que sabes sempre o que precisas para avançar com confiança nesta nova etapa.
                </p>
            </section>
                <div className="card">
                    <img src="/images/buddie-logo-wht.png" alt="logo" />
                </div>
            </section>

        </>
    );
}

export default About;
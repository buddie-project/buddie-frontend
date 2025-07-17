import "../style/About.css";
import "../style/App.css";
import {useEffect} from "react";

/**
 * Componente About.
 * Representa a página "Sobre" da aplicação, fornecendo informações
 * sobre o propósito e as funcionalidades do projeto Buddie.
 * Inclui uma funcionalidade de scroll suave para uma secção específica.
 * @returns {JSX.Element} O componente About.
 */
function About() {

    /**
     * Efeito para gerir o comportamento do botão de "scroll down".
     * Adiciona um event listener para que, ao clicar, a página desça suavemente
     * até a secção de conteúdo principal.
     * O listener é removido quando o componente é desmontado.
     */
    useEffect(() => {
        const scrollDownButton = document.getElementById('scroll-down');
        if (!scrollDownButton) return;

        /**
         * Lida com o clique no botão de scroll, fazendo a página descer suavemente.
         */
        const handleClick = () => {
            const nextSection = document.querySelector('.about-section');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
        };

        scrollDownButton.addEventListener('click', handleClick);

        return () => scrollDownButton.removeEventListener('click', handleClick);
    }, []);

    /**
     * Efeito para adicionar e remover a classe 'about-page' ao `body` do documento.
     * Isso permite estilos específicos da página "Sobre" no body.
     */
    useEffect(() => {
        document.body.classList.add('about-page');
        return () => document.body.classList.remove('about-page');
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
                    <h2>O Buddie ajuda!</h2>
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
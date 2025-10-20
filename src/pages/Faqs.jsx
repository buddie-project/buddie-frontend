import React, {useEffect, useState} from "react";
import "../style/Faqs.css";
import api from "../services/api.js";

/**
 * Componente Faqs.
 * Exibe uma lista de Perguntas Frequentes (FAQs) com funcionalidade de expandir/colapsar.
 * Busca as FAQs de uma API local.
 * @returns {JSX.Element} O componente Faqs.
 */
function Faqs() {
    /**
     * Estado para armazenar a lista de FAQs.
     * @type {[Array<object>, React.Dispatch<React.SetStateAction<Array<object>>>]}
     */
    const [faqs, setFaqs] = useState([]);
    /**
     * Estado para controlar o índice da FAQ atualmente aberta (expandida).
     * `null` se nenhuma FAQ estiver aberta.
     * @type {[number|null, React.Dispatch<React.SetStateAction<number|null>>]}
     */
    const [openIndex, setOpenIndex] = useState(null);

    /**
     * Efeito para buscar as FAQs do backend quando o componente é montado.
     */
    useEffect(() => {
        api.get("/api/faqs")
            .then((res) => setFaqs(res.data))
            .catch((error) => {
                console.error("Erro ao carregar FAQs:", error);
            });
    }, []);

    /**
     * Alterna a visibilidade da resposta de uma FAQ específica.
     * Se a FAQ clicada já estiver aberta, ela será fechada; caso contrário, será aberta.
     * @param {number} index - O índice da FAQ a ser alternada.
     */
    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <div className="faqs-container">
                <div className="faqs-left">
                    <div className="faqs-left-content">
                        <h1>Alguma questão?</h1>
                        <h1>Pergunta-nos!</h1>
                    </div>
                    <p>O Buddie foi criado para esclarecer todas as tuas dúvidas!<br/>
                        Estas são algumas das questões mais frequentes sobre<br/>
                        o regime de acesso ao ensino superior, dedicado a<br/>
                        maiores de 23 anos.</p>
                </div>

                <div className="faqs-right">
                    {faqs.map((faq, index) => (
                        <div className={`faq-item ${openIndex === index ? 'active' : ''}`} key={index}>
                            <div className="faq-question" onClick={() => toggleFaq(index)}>
                                <h2>{faq.questionText}</h2>
                                <h2 className="symbol">{openIndex === index ? '-' : '+'}</h2>
                            </div>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answerText}</p>
                                </div>
                            )}
                            <div className="bottom-line"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Faqs;
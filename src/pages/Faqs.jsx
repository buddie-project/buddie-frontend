import React, {useEffect, useState} from "react";
import "../style/Faqs.css";

function Faqs() {
    const [faqs, setFaqs] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/faqs")
            .then((response) => response.json())
            .then((data) => {
                setFaqs(data);
            })
            .catch((error) => {
                console.error("Erro ao carregar FAQs:", error);
            });
    }, []);

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
                    <p className="more-faqs">Mais FAQ's</p>
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

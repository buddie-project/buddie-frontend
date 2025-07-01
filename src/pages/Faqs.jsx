import React, {useState} from "react";
import "../style/Faqs.css";

function Faqs() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "O que preciso saber para avançar com a candidatura?",
            answer: "This website provides information about various topics."
        },
        {
            question: "Como posso obter mais informação?",
            answer: "You can contact support via the contact form on our website."
        },
        {
            question: "Como posso candidatar-me a um curso?",
            answer: "More information can be found in the documentation section of our website."
        },
        {
            question: "Qual é o valor das propinas?",
            answer: "Requirements vary by course, please check the specific course details."
        }
    ];

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
                    <p>sfklnvksfnv sfpvskp of mpmfv fvojmpemrv aervkmaepromv<br/>
                        arpmvpaerokpakopmprm,okfapomrgm arepojagpre aperok<br/>
                        aporjgpjairejgapier poarpomrg poregpoaerm repogakoprºr<br/>
                        arpmvpaerokpakopmprm,okfapomrgm arepojagpre aperok</p>
                    <p className="more-faqs">Mais FAQ's</p>
                </div>

                <div className="faqs-right">
                    {faqs.map((faq, index) => (
                        <div className={`faq-item ${openIndex === index ? 'active' : ''}`} key={index}>
                            <div className="faq-question" onClick={() => toggleFaq(index)}>
                                <h2>{faq.question}</h2>
                                <h2 className="symbol">{openIndex === index ? '-' : '+'}</h2>
                            </div>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
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

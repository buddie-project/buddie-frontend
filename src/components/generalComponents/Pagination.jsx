import { useState, useEffect } from "react";
import "../../style/Pagination.css";

/**
 * @typedef {object} PaginationProps
 * @property {function(number): void} onPageChange - Função de callback para ser chamada quando a página muda.
 * @property {number} currentPage - A página atual.
 * @property {number} totalPages - O número total de páginas.
 */

/**
 * Componente de Paginação.
 * Permite aos utilizadores navegar entre páginas e introduzir o número da página desejada.
 *
 * @param {PaginationProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente Pagination.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    /**
     * Estado para o valor do input da página.
     * @type {string}
     */
    const [inputPage, setInputPage] = useState(currentPage.toString());

    /**
     * Efeito para sincronizar o valor do inputPage com a prop currentPage.
     * Reage a mudanças na página atual.
     */
    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    /**
     * Lida com a mudança no input do número da página.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
     */
    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    /**
     * Lida com a tecla pressionada no input do número da página.
     * Se a tecla Enter for pressionada, tenta navegar para a página inserida.
     * @param {React.KeyboardEvent<HTMLInputElement>} e - O evento de tecla pressionada.
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const page = parseInt(inputPage, 10);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                onPageChange(page);
            } else {
                setInputPage(currentPage.toString());
            }
        }
    };

    /**
     * Navega para a página anterior, se não for a primeira página.
     */
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    /**
     * Navega para a próxima página, se não for a última página.
     */
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination">
            <button className="pagination-button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                <i className="icon-left-arrow" aria-hidden="true"></i>
            </button>

            <input
                type="text"
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="pagination-input"
            />
            <span className="total-pages"> / {totalPages}</span>

            <button className="pagination-button" onClick={goToNextPage} disabled={currentPage === totalPages}>
                <i className="icon-right-arrow" aria-hidden="true"></i>
            </button>
        </div>
    );
};

export default Pagination;
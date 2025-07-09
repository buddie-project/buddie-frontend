import { useState, useEffect } from "react";
import "../../style/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [inputPage, setInputPage] = useState(currentPage.toString());

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const page = parseInt(inputPage, 10);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                onPageChange(page);
            } else {
                setInputPage(currentPage.toString()); // reset se inválido
            }
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

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

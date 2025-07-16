import React, {useState, useEffect, useRef, useCallback} from 'react';
import "../../style/Autocomplete.css";

/**
 * @typedef {object} AutocompleteDropdownProps
 * @property {string} label - O texto do placeholder para o input.
 * @property {string} value - O valor atual do input.
 * @property {string[]} options - Uma matriz de strings para as opções de sugestão.
 * @property {(value: string) => void} onValueChange - Função de callback para ser chamada quando o valor do input muda.
 * @property {string} [className=""] - Classes CSS adicionais para o componente wrapper.
 */

/**
 * Um componente de dropdown de autocomplete reutilizável.
 * Permite aos utilizadores escrever um texto e ver sugestões filtradas
 * de uma lista de opções fornecida.
 *
 * @param {AutocompleteDropdownProps} props - As propriedades do componente.
 * @returns {JSX.Element} O componente AutocompleteDropdown.
 */
const AutocompleteDropdown = ({
                                  label,
                                  value,
                                  options,
                                  onValueChange,
                                  className = "",
                              }) => {
    /**
     * Estado para o valor atual do input do campo de texto.
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [inputValue, setInputValue] = useState(value || "");
    /**
     * Estado para as sugestões filtradas exibidas no dropdown.
     * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
     */
    const [suggestions, setSuggestions] = useState(options);
    /**
     * Estado para controlar a visibilidade do dropdown de sugestões.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isOpen, setIsOpen] = useState(false);
    /**
     * Ref para o elemento DOM do wrapper do componente.
     * Usado para detectar cliques fora do componente.
     * @type {React.RefObject<HTMLDivElement>}
     */
    const wrapperRef = useRef(null);

    /**
     * Efeito para sincronizar o inputValue com a prop 'value' e controlar o estado 'isOpen'.
     * Fechar o dropdown e redefinir as sugestões se o valor for limpo externamente.
     */
    // Atualiza inputValue quando a prop "value" muda
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

// Atualiza as sugestões quando as opções mudam
    useEffect(() => {
        setSuggestions(options);
    }, [options]);


    /**
     * Efeito para adicionar e remover um event listener para detetar cliques fora do componente,
     * o que fecha o dropdown de sugestões.
     */
    useEffect(() => {
        /**
         * Lida com cliques fora do componente para fechar o dropdown.
         * @param {MouseEvent} event - O evento de clique.
         */
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    /**
     * Lida com a mudança do input de texto, filtra as sugestões e abre o dropdown.
     * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
     */
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onValueChange(newValue);

        if (newValue.length > 0) {
            const filtered = options.filter(option =>
                option.toLowerCase().includes(newValue.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions(options);
        }
        setIsOpen(true);
    };

    /**
     * Lida com a seleção de uma sugestão no dropdown.
     * Define o input com a sugestão selecionada e fecha o dropdown.
     * @param {string} suggestion - A sugestão selecionada.
     */
    const handleSelectSuggestion = useCallback((suggestion) => {
        setInputValue(suggestion);
        onValueChange(suggestion);
        setIsOpen(false);
    }, [onValueChange]);


    /**
     * Lida com o foco no input. Se o input já contiver um valor de uma opção existente,
     * limpa o input para permitir uma nova pesquisa. Abre o dropdown.
     */
    const handleInputFocus = () => {
        if (inputValue && options.includes(inputValue)) {
            setInputValue("");
            onValueChange("");

        }
        setSuggestions(options);
        setIsOpen(true);
    };

    const renderSuggestionItem = (suggestion, index) => (
        <li
            key={suggestion + index}
            onClick={() => handleSelectSuggestion(suggestion)}
        >
            {suggestion}
        </li>
    );

    return (
        <div className={`autocomplete-dropdown-wrapper ${className}`} ref={wrapperRef}>
            <input
                type="text"
                placeholder={label}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="autocomplete-dropdown-input"
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="autocomplete-dropdown-suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={suggestion + index} onClick={() => handleSelectSuggestion(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && suggestions.length > 0 && (
                <ul className="autocomplete-dropdown-suggestions">
                    {suggestions.map(renderSuggestionItem)}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteDropdown;
import React, { useState, useEffect, useRef } from 'react';
import "../../style/Autocomplete.css";

const AutocompleteDropdown = ({
                                  label,
                                  value,
                                  options,
                                  onValueChange,
                                  className = "",
                              }) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [suggestions, setSuggestions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInputValue(value || "");

        if (!value && isOpen) {
            setIsOpen(false);
            setSuggestions(options);
        }
    }, [value, options]);


    useEffect(() => {
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

    const handleSelectSuggestion = (suggestion) => {
        setInputValue(suggestion);
        onValueChange(suggestion);
        setIsOpen(false);
    };

    const handleInputFocus = () => {

        setSuggestions(options);
        setIsOpen(true);
    };


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
            {isOpen && inputValue.length > 0 && suggestions.length === 0 && (
                <ul className="autocomplete-dropdown-suggestions">
                    <li className="no-suggestions">Nenhuma sugestão encontrada</li>
                </ul>
            )}
        </div>
    );
};

export default AutocompleteDropdown;
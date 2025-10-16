import { useState, useRef, useEffect } from "react";
import "./Dropdown.scss";

interface DropdownOption {
    value: string;
    label: string;
    icon?: string;
}

interface DropdownProps {
    label: string;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const Dropdown = ({ label, options, value, onChange, className = "" }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);
    const availableOptions = options.filter(option => option.value !== value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) setIsOpen(false);
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
            <label>{label}</label>
            <div className="dropdown-header" onClick={toggleDropdown}>
                <div className="dropdown-header-content">
                    {selectedOption?.icon && (
                        <img src={selectedOption.icon} alt={selectedOption.label} className="option-icon" />
                    )}
                    <span>{selectedOption?.label}</span>
                </div>
                <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</div>
            </div>
            {isOpen && (
                <div className="dropdown-options scrollPreventDefault">
                    {availableOptions.map(option => (
                        <div
                            key={option.value}
                            className="dropdown-option"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(option.value);
                            }}
                        >
                            {option.icon && (
                                <img src={option.icon} alt={option.label} className="option-icon" />
                            )}
                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
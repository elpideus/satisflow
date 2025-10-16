import "./OverclockingSection.scss";
import {PowerShardIcon} from "../../assets/images/satisfactory/icons/items";
import {useState, useEffect} from "react";
import * as React from "react";

export const OverclockingSection = (props: {value: number, onChange: (value: number) => void}) => {
    const [overclockAmount, setOverclockAmount] = useState(props?.value || 100);
    useEffect(() => setOverclockAmount(props?.value || 100), [props.value]);

    const handleInputChange = (value: number) => {
        const clampedValue = Math.max(1, Math.min(250, value));
        setOverclockAmount(clampedValue);
        props.onChange(clampedValue);
    };

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) handleInputChange(value);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const snappedValue = Math.round(value / 10) * 10;
        handleInputChange(snappedValue);
    };

    const handleIncrement = (direction: 'up' | 'down', step: number) => {
        const current = overclockAmount;

        if (step === 10) {
            if (direction === 'up') {
                const nextMultiple = Math.ceil(current / 10) * 10;
                const newValue = current % 10 === 0 ? nextMultiple + 10 : nextMultiple;
                handleInputChange(Math.min(250, newValue));
            } else {
                const prevMultiple = Math.floor(current / 10) * 10;
                const newValue = current % 10 === 0 ? prevMultiple - 10 : prevMultiple;
                handleInputChange(Math.max(1, newValue));
            }
        } else {
            const newValue = direction === 'up' ? current + 1 : current - 1;
            handleInputChange(newValue);
        }
    };

    const handlePreset = (presetValue: number) => handleInputChange(presetValue);;

    return (
        <div className="overclocking-section">
            <h2 className="title">
                <img className="icon" src={PowerShardIcon} alt="Power Shard Icon" />
                Overclocking
            </h2>

            <span className="preset-buttons">
                <button onClick={() => handlePreset(100)}>Default (100%)</button>
                <button onClick={() => handlePreset(250)}>Max (250%)</button>
            </span>

            <span className="input-section">
                <button onClick={() => handleIncrement('down', 10)}>-10</button>
                <button onClick={() => handleIncrement('down', 1)}>-1</button>
                <input
                    min="1"
                    max="250"
                    maxLength={3}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={overclockAmount}
                    onChange={handleTextInputChange}
                />
                <button onClick={() => handleIncrement('up', 1)}>+1</button>
                <button onClick={() => handleIncrement('up', 10)}>+10</button>
            </span>

            <div className="slider-section">
                <input
                    type="range"
                    min="1"
                    max="250"
                    step="1"
                    className="slider dragPreventDefault"
                    value={overclockAmount}
                    onChange={handleSliderChange}
                />
                <div className="slider-ticks">
                    {[...Array(25)].map((_, i) => (
                        <span key={i} className="slider-tick"></span>
                    ))}
                </div>
            </div>
        </div>
    )
}
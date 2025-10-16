import {OverclockingSection} from "./components/OverclockingSection.tsx";
import "./Node.scss";
import {Handle, Position} from "@xyflow/react";
import {CoalGeneratorIcon} from "../assets/images/satisfactory/icons/buildings";
import {useState} from "react";
import {
    CableIcon,
    CoalIcon,
    CompactedCoalIcon,
    ConcreteIcon,
    MotorIcon, PetroleumCokeIcon,
    ReinforcedIronPlateIcon, WaterIcon
} from "../assets/images/satisfactory/icons/items";
import {InfoPopup} from "./components/InfoPopup.tsx";
import {NodeBuildingIcon} from "./components/BuildingIcon.tsx";

export const CoalGeneratorNode = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [overclockPercentage, setOverclockPercentage] = useState(100);
    const [powerProduction, setPowerProduction] = useState(75);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const handleOverclockChange = (value: number) => {
        setOverclockPercentage(value);
        setPowerProduction(75*(overclockPercentage/100));
    };

    const basePowerOutput = 75;
    const calculatedPowerOutput = (basePowerOutput * overclockPercentage / 100).toFixed(1);

    const description = "Burns Coal to boil Water, the produced steam rotates turbines to generate" +
        "electricity for the power grid. Has a Conveyor Belt and Pipe input, so both the Coal and Water supply can" +
        "be automated. Caution: Always generates at the set clock speed. Shuts down if fuel requirements are not met.";
    const shouldTruncate = description.length > 128;
    const displayDescription = isDescriptionExpanded ? description : (shouldTruncate ? description.slice(0, 128) + '...' : description);

    return (
        <div className="node">
            <NodeBuildingIcon icon={CoalGeneratorIcon} alt="Coal Generator" isPopupOpen={isPopupOpen} onToggle={togglePopup} />

            <InfoPopup isPopupOpen={isPopupOpen}>
                <div className="popup-title">
                    <h2>Coal Generator</h2>
                    <h3 className="popup-category">Power Generation</h3>
                </div>

                <div className="popup-info-section">
                    <h3>Description</h3>
                    <p className={`description ${shouldTruncate ? 'truncatable' : ''}`}
                       style={{ maxHeight: isDescriptionExpanded ? '500px' : '7.5rem' }}
                    >
                        {displayDescription}
                        {shouldTruncate && (
                            <button className="popup-more-link" onClick={toggleDescription}>
                                {isDescriptionExpanded ? ' Less' : ' More'}
                            </button>
                        )}
                    </p>
                </div>

                <div className="popup-info-section">
                    <h3>Power Production</h3>
                    <div className="info-cards-section-grid">
                        <div className="popup-info-card">
                            <span className="label">Base Output:</span>
                            <span className="value">{basePowerOutput} MW</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Overclock:</span>
                            <span className="value">{overclockPercentage}%</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Current Output:</span>
                            <span className="value">{calculatedPowerOutput} MW</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Fuel Consumption:</span>
                            <span className="value">{(15 * overclockPercentage / 100).toFixed(1)}/min</span>
                        </div>
                    </div>
                </div>

                <div className="popup-info-section">
                    <h3>Accepted Fuels</h3>
                    <section className="info-cards-section">
                        <div className="popup-info-card">
                            <img src={CoalIcon} alt="Coal" />
                            <span className="label">Coal</span>
                        </div>
                        <div className="popup-info-card">
                            <img src={CompactedCoalIcon} alt="Compacted Coal" />
                            <span className="label">Compacted Coal</span>
                        </div>
                        <div className="popup-info-card">
                            <img src={PetroleumCokeIcon} alt="Petroleum Coke" />
                            <span className="label">Petroleum Coke</span>
                        </div>
                    </section>
                </div>

                <div className="popup-info-section">
                    <h3>Dimensions</h3>
                    <div className="info-cards-section-grid">
                        <div className="popup-info-card">
                            <span className="label">Width:</span>
                            <span className="value">12m</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Height:</span>
                            <span className="value">18m</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Length:</span>
                            <span className="value">10m</span>
                        </div>
                        <div className="popup-info-card">
                            <span className="label">Area:</span>
                            <span className="value">120m²</span>
                        </div>
                    </div>
                </div>

                <div className="popup-info-section">
                    <h3>Build Materials</h3>
                    <section className="info-cards-section">
                        <div className="popup-info-card">
                            <img src={ConcreteIcon} alt="Concrete" />
                            <span className="label">Concrete:</span>
                            <span className="value">20</span>
                        </div><div className="popup-info-card">
                        <img src={ReinforcedIronPlateIcon} alt="Reinforced Iron Plate" />
                        <span className="label">Reinforced Iron Plate:</span>
                        <span className="value">10</span>
                    </div><div className="popup-info-card">
                        <img src={MotorIcon} alt="Motor" />
                        <span className="label">Motor:</span>
                        <span className="value">5</span>
                    </div><div className="popup-info-card">
                        <img src={CableIcon} alt="Cable" />
                        <span className="label">Cable:</span>
                        <span className="value">20</span>
                    </div>
                    </section>
                </div>
            </InfoPopup>

            <h1 className="title">Coal Generator</h1>
            <OverclockingSection value={overclockPercentage} onChange={handleOverclockChange} />
            <div className="power-indicator">
                <h2>Power Production:</h2>
                <span>{powerProduction} MW</span>
            </div>

            <div className="handle-container">
                <div className="handles-left">
                    {/* Coal Input */}
                    <div className="handle-wrapper left-handle">
                        <Handle id="input-coal" className="dragPreventDefault" type="target" position={Position.Left} />
                        <div className="custom-tooltip">
                            <div className="tooltip-card">
                                <img src={CoalIcon} alt="Coal" className="tooltip-icon" />
                                <div className="tooltip-content">
                                    <span className="tooltip-title">Coal</span>
                                    <span className="tooltip-type">Solid Fuel Input</span>
                                </div>
                            </div><div className="tooltip-card">
                            <img src={CompactedCoalIcon} alt="Compacted Coal" className="tooltip-icon" />
                            <div className="tooltip-content">
                                <span className="tooltip-title">Compacted Coal</span>
                                <span className="tooltip-type">Solid Fuel Input</span>
                            </div>
                        </div><div className="tooltip-card">
                            <img src={PetroleumCokeIcon} alt="Petroleum Coke" className="tooltip-icon" />
                            <div className="tooltip-content">
                                <span className="tooltip-title">Petroleum Coke</span>
                                <span className="tooltip-type">Solid Fuel Input</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="handle-wrapper left-handle">
                        <Handle id="input-water" className="dragPreventDefault" type="target" position={Position.Left} />
                        <div className="custom-tooltip">
                            <div className="tooltip-card">
                                <img src={WaterIcon} alt="Water" className="tooltip-icon" />
                                <div className="tooltip-content">
                                    <span className="tooltip-title">Water</span>
                                    <span className="tooltip-type">Liquid Input</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
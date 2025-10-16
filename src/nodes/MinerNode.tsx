import {OverclockingSection} from "./components/OverclockingSection.tsx";
import {useState} from "react";
import {
    IronOreIcon,
    CopperOreIcon,
    LimestoneIcon,
    CoalIcon,
    SulfurIcon,
    CateriumOreIcon,
    BauxiteIcon,
    SAMOreIcon,
    UraniumIcon,
    ConcreteIcon,
    PortableMinerIcon,
    IronPlateIcon,
    EncasedIndustrialBeamIcon,
    SteelPipeIcon,
    ModularFrameIcon,
    SupercomputerIcon,
    FusedModularFrameIcon, TurboMotorIcon
} from "../assets/images/satisfactory/icons/items";
import { Dropdown } from "./components/Dropdown.tsx";
import {InfoPopup} from "./components/InfoPopup.tsx";
import {NodeBuildingIcon} from "./components/BuildingIcon.tsx";
import {MinerMk1Icon} from "../assets/images/satisfactory/icons/buildings";
import {MinerMk2Icon} from "../assets/images/satisfactory/icons/buildings";
import {MinerMk3Icon} from "../assets/images/satisfactory/icons/buildings";
import { Handle, Position } from "@xyflow/react";
import "./Node.scss";

export const MinerNode = () => {
    const [overclockPercentage, setOverclockPercentage] = useState(100);
    const [minerType, setMinerType] = useState("Mk.1");
    const [oreType, setOreType] = useState("Iron Ore");
    const [oreQuality, setOreQuality] = useState("Normal");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const description = "Extracts solid resources from the resource node it is built on.\n" +
        "The normal extraction rate is 60 resources per minute.\n" +
        "The extraction rate is modified depending on resource purity. Outputs all extracted resources onto connected conveyor belts.";
    const shouldTruncate = description.length > 128;
    const displayDescription = isDescriptionExpanded ? description : (shouldTruncate ? description.slice(0, 128) + '...' : description);

    const handleOverclockChange = (value: number) => {
        setOverclockPercentage(value);
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const minerData = {
        "Mk.1": {
            icon: MinerMk1Icon,
            label: "Mk.1",
            basePower: 5,
            miningSpeed: {
                "Impure": 30,
                "Normal": 60,
                "Pure": 120
            },
            buildMaterials: [
                { name: "Portable Miner", icon: PortableMinerIcon, quantity: 1 },
                { name: "Iron Plate", icon: IronPlateIcon, quantity: 10 },
                { name: "Concrete", icon: ConcreteIcon, quantity: 10 }
            ]
        },
        "Mk.2": {
            icon: MinerMk2Icon,
            label: "Mk.2",
            basePower: 15,
            miningSpeed: {
                "Impure": 60,
                "Normal": 120,
                "Pure": 240
            },
            buildMaterials: [
                { name: "Portable Miner", icon: PortableMinerIcon, quantity: 2 },
                { name: "Encased Industrial Beam", icon: EncasedIndustrialBeamIcon, quantity: 10 },
                { name: "Steel Pipe", icon: SteelPipeIcon, quantity: 20 },
                { name: "Modular Frame", icon: ModularFrameIcon, quantity: 10 }
            ]
        },
        "Mk.3": {
            icon: MinerMk3Icon,
            label: "Mk.3",
            basePower: 45,
            miningSpeed: {
                "Impure": 120,
                "Normal": 240,
                "Pure": 480
            },
            buildMaterials: [
                { name: "Portable Miner", icon: PortableMinerIcon, quantity: 3 },
                { name: "Steel Pipe", icon: SteelPipeIcon, quantity: 50 },
                { name: "Supercomputer", icon: SupercomputerIcon, quantity: 5 },
                { name: "Fused Modular Frame", icon: FusedModularFrameIcon, quantity: 10 },
                { name: "Turbo Motor", icon: TurboMotorIcon, quantity: 3 }
            ]
        }
    };

    // 1. New calculation function for Power Consumption
    const calculatePowerConsumption = (miner: keyof typeof minerData, overclock: number) => {
        const basePower = minerData[miner].basePower;
        // Formula for power consumption in Satisfactory is P_new = P_base * (Overclock / 100)^1.3
        const powerConsumption = basePower * Math.pow(overclock / 100, 1.3);
        return powerConsumption.toFixed(1); // Keep one decimal place for display
    };

    // 2. New calculation function for Output per Minute
    const calculateOutputPerMinute = (miner: keyof typeof minerData, quality: string, overclock: number) => {
        const baseOutput = minerData[miner].miningSpeed[quality as keyof typeof minerData["Mk.1"]["miningSpeed"]];
        // Formula for output in Satisfactory is Output = Base_Output * (Overclock / 100)
        const output = baseOutput * (overclock / 100);
        return output.toFixed(1); // Keep one decimal place for display
    };

    const currentPowerConsumption = calculatePowerConsumption(minerType as keyof typeof minerData, overclockPercentage);
    const currentOutputPerMinute = calculateOutputPerMinute(minerType as keyof typeof minerData, oreQuality, overclockPercentage);

    const minerTypes = Object.entries(minerData).map(([value, data]) => ({
        value,
        label: data.label
    }));

    const oreTypes = [
        { value: "Iron Ore", label: "Iron Ore", icon: IronOreIcon },
        { value: "Copper Ore", label: "Copper Ore", icon: CopperOreIcon },
        { value: "Limestone", label: "Limestone", icon: LimestoneIcon },
        { value: "Coal", label: "Coal", icon: CoalIcon },
        { value: "Sulfur", label: "Sulfur", icon: SulfurIcon },
        { value: "Caterium Ore", label: "Caterium Ore", icon: CateriumOreIcon },
        { value: "Bauxite", label: "Bauxite", icon: BauxiteIcon },
        { value: "SAM Ore", label: "S.A.M. Ore", icon: SAMOreIcon },
        { value: "Uranium", label: "Uranium", icon: UraniumIcon }
    ];

    const oreQualities = [
        { value: "Impure", label: "Impure" },
        { value: "Normal", label: "Normal" },
        { value: "Pure", label: "Pure" }
    ];

    // Get the current ore icon based on selected ore type
    const currentOreIcon = oreTypes.find(ore => ore.value === oreType)?.icon;

    return (
        <div className="node">
            <NodeBuildingIcon icon={minerData[minerType].icon} alt="Miner" isPopupOpen={isPopupOpen} onToggle={togglePopup} />
            <InfoPopup isPopupOpen={isPopupOpen}>
                <div className="popup-content">
                    <div className="popup-title">
                        <h2>{minerType} Miner</h2>
                        <h3 className="popup-category">Production</h3>
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
                        <h3>Dimensions</h3>
                        <div className="info-cards-section-grid">
                            <div className="popup-info-card">
                                <span className="label">Width:</span>
                                <span className="value">6m</span>
                            </div>
                            <div className="popup-info-card">
                                <span className="label">Height:</span>
                                <span className="value">18</span>
                            </div>
                            <div className="popup-info-card">
                                <span className="label">Length:</span>
                                <span className="value">14</span>
                            </div>
                            <div className="popup-info-card">
                                <span className="label">Area:</span>
                                <span className="value">84m²</span>
                            </div>
                        </div>
                    </div>

                    <div className="popup-info-section">
                        <h3>Build Materials</h3>
                        <section className="info-cards-section">
                            {minerData[minerType].buildMaterials.map(material => (
                                <div key={material.name.replace(" ", "")} className="popup-info-card">
                                    <img src={material.icon} alt={material.name} />
                                    <span className="label">{material.name}:</span>
                                    <span className="value">{material.quantity}</span>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </InfoPopup>
            <h1 className="title">Miner</h1>

            <div className="inputs-section">
                <Dropdown
                    label="Type"
                    options={minerTypes}
                    value={minerType}
                    onChange={setMinerType}
                    className="short"
                />

                <Dropdown
                    label="Ore"
                    options={oreTypes}
                    value={oreType}
                    onChange={setOreType}
                />

                <Dropdown
                    label="Quality"
                    options={oreQualities}
                    value={oreQuality}
                    onChange={setOreQuality}
                />
            </div>

            <OverclockingSection value={overclockPercentage} onChange={handleOverclockChange} />

            {/* 2. New Power Consumption Section */}
            <div className="power-indicator">
                <span className="label">Power Usage:</span>
                <span className="value">{currentPowerConsumption} MW</span>
            </div>

            {/* Handle container for output */}
            <div className="handle-container">
                <div className="handles-right">
                    {/* Ore Output */}
                    <div className="handle-wrapper right-handle">
                        <Handle
                            id="output-ore"
                            className="dragPreventDefault"
                            type="source"
                            position={Position.Right}
                        />
                        <div className="custom-tooltip">
                            <div className="tooltip-card">
                                <img src={currentOreIcon} alt={oreType} className="tooltip-icon" />
                                <div className="tooltip-content">
                                    <span className="tooltip-title">{oreType}</span>
                                    <span className="tooltip-type">Ore Output</span>
                                    <span className="tooltip-rate">{currentOutputPerMinute}/min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
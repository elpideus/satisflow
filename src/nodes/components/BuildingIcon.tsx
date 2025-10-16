import "./BuildingIcon.scss";

interface NodeBuildingIconProps {
    icon: string;
    alt: string;
    isPopupOpen: boolean;
    onToggle: () => void;
}

export const NodeBuildingIcon = ({ icon, alt, isPopupOpen, onToggle }: NodeBuildingIconProps) => {
    return (
        <div className={`building-icon${isPopupOpen ? " open" : ""}`} onClick={onToggle}>
            <img src={icon} alt={alt} />
        </div>
    );
};
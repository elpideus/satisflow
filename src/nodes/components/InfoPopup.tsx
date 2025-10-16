import "./InfoPopup.scss";
import * as React from "react";

export const InfoPopup = (props: { isPopupOpen: boolean; children: React.ReactNode }) => {
    return (
        <div className={`building-info-popup ${props.isPopupOpen ? 'open' : ''}`}>
            <div className="popup-content">
                {props.children}
            </div>
        </div>
    )
}
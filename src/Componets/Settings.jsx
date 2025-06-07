import '../Style/Settings.css';
import { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export default function Settings({ handlePrevious, handleContinue, currentDay }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleGearClick = () => {
        setIsPanelOpen((prev) => !prev);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const monthName = date.toLocaleString('en-US', { month: 'long' }); 
        const year = date.getFullYear();
        return `${day} ${monthName} ${year}`;
    };

    return (
        <>
            <div className='Buttons'>
                <button onClick={handleGearClick} style={{ zIndex: 99 }}>
                    <FaGear color='white' size={20} />
                </button>

                <div className={`SettingsPanel ${isPanelOpen ? 'close' : 'open'}`}>
                    <button onClick={handlePrevious} className='btn'>
                        <FaArrowLeft color='white' size={20} />
                    </button>

                    <button onClick={handleContinue}>
                        <FaArrowRight color="white" size={20} />
                    </button>

                    <h2>{formatDate(currentDay)}</h2>
                </div>
            </div>
        </>
    );
}

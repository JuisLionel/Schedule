import '../Style/Settings.css';
import { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export default function Settings({ handlePrevious, handleContinue, currentDay }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleGearClick = () => {
        setIsPanelOpen((prev) => !prev);
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
                    </button >

                    <button onClick={handleContinue}>
                        <FaArrowRight color="white" size={20} />
                    </button>

                    <h2>{currentDay}</h2>
                </div>
            </div>
        </>
    );
}

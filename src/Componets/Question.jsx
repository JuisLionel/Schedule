import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoPauseSharp } from "react-icons/io5";
import { AiOutlineCaretRight } from "react-icons/ai";

export default function Question({ isPaused, turn, pause, GakBisa, Bisa }) {
    return (
        <div className='Check'>
            {!isPaused ? (
                <>
                    <h2>Apakah {turn} bisa mencuci piring?</h2>

                    <button onClick={GakBisa}>
                        <IoCloseSharp color="Red" size={25} />
                    </button>

                    <button onClick={Bisa}>
                        <FaCheck color="Green" size={20} />
                    </button>
                </>
            ) : (
                <h2>Jadwal sedang dijeda</h2>
            )}

            <button onClick={pause}>
                {!isPaused ? (
                    <IoPauseSharp color="Orange" size={20} />
                ) : (
                    <AiOutlineCaretRight color="Orange" size={20} />
                )}
            </button>
        </div>
    );
}

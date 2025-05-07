import '../Style/Something.css';
import React, { useState, useEffect } from 'react';

import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";

export default function Something() {
    const [turn, setTurn] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [skipCount, setSkipCount] = useState({ lionel: 0, felix: 0 });
    const [nextTurn, setNextTurn] = useState('');

    useEffect(() => {
        const startDate = new Date('2024-01-01');
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let scheduledTurn = diffDays % 2 === 0 ? 'Lionel' : 'Felix';

        // Load skip data from localStorage
        const storedSkip = JSON.parse(localStorage.getItem('skipCount')) || {
            lionel: 0,
            felix: 0,
            lastUpdate: ''
        };

        // Check if today is a new day
        if (storedSkip.lastUpdate !== todayStr) {
            // Apply skip logic only once per day
            if (scheduledTurn === 'Lionel' && storedSkip.lionel > 0) {
                storedSkip.lionel -= 1;
                scheduledTurn = 'Felix';
            } else if (scheduledTurn === 'Felix' && storedSkip.felix > 0) {
                storedSkip.felix -= 1;
                scheduledTurn = 'Lionel';
            }

            storedSkip.lastUpdate = todayStr;
            localStorage.setItem('skipCount', JSON.stringify(storedSkip));
        } else {
            // If skip already applied today, just adjust the display
            if (scheduledTurn === 'Lionel' && storedSkip.lionel > 0) {
                scheduledTurn = 'Felix';
            } else if (scheduledTurn === 'Felix' && storedSkip.felix > 0) {
                scheduledTurn = 'Lionel';
            }
        }

        setTurn(scheduledTurn);
        setSkipCount({ lionel: storedSkip.lionel, felix: storedSkip.felix });

        // Load checked status
        const savedStatus = JSON.parse(localStorage.getItem('dishStatus')) || {};
        if (savedStatus.date === todayStr && savedStatus.checked) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }

        // Set tomorrow's turn
        const tomorrowDiffDays = diffDays + 1;
        const tomorrowScheduled = tomorrowDiffDays % 2 === 0 ? 'Lionel' : 'Felix';
        setNextTurn(tomorrowScheduled);
    }, []);

    const GakBisa = () => {
        const newTurn = turn === 'Lionel' ? 'Felix' : 'Lionel';
        setTurn(newTurn);
        setIsChecked(true);

        const todayStr = new Date().toISOString().split('T')[0];
        const storedSkip = JSON.parse(localStorage.getItem('skipCount')) || {
            lionel: 0,
            felix: 0,
            lastUpdate: ''
        };

        if (turn === 'Lionel') {
            storedSkip.lionel += 1;
        } else {
            storedSkip.felix += 1;
        }

        localStorage.setItem('skipCount', JSON.stringify(storedSkip));
        setSkipCount({ lionel: storedSkip.lionel, felix: storedSkip.felix });

        // Save checked status
        localStorage.setItem('dishStatus', JSON.stringify({
            date: todayStr,
            checked: true
        }));
    };

    const Bisa = () => {
        setIsChecked(true);
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem('dishStatus', JSON.stringify({
            date: todayStr,
            checked: true
        }));
    };

    return (
        <div className="container">
            <div className="card">
                <h1>{turn}</h1>
            </div>

            {!isChecked ? (
                <div className='Check'>
                    <h2>Apakah {turn} tidak bisa cuci piring?</h2>

                    <button onClick={GakBisa}>
                        <AiOutlineClose color="Red" size={16} />
                    </button>

                    <button onClick={Bisa}>
                        <AiOutlineCheck color="Green" size={16} />
                    </button>
                </div>
            ) : (
                <div className='Check'>
                    <h2>Besok giliran: <strong>{nextTurn}</strong></h2>
                </div>
            )}
        </div>
    );
}

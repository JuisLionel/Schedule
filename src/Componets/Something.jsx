import '../Style/Something.css';
import React, { useState, useEffect } from 'react';

import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { IoPauseSharp } from "react-icons/io5";
import { AiOutlineCaretRight } from "react-icons/ai";

export default function Something() {
    const [turn, setTurn] = useState('');
    const [nextTurn, setNextTurn] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [lionelDishes, setLionelDishes] = useState(0);
    const [felixDishes, setFelixDishes] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('dishScheduleState'));
        const storedDate = localStorage.getItem('dishCheckedDate');
        const today = new Date().toISOString().split('T')[0];

        if (savedState) {
            setTurn(savedState.turn);
            setNextTurn(savedState.nextTurn);
            setLionelDishes(savedState.lionelDishes);
            setFelixDishes(savedState.felixDishes);
            setIsPaused(savedState.isPaused);
        } else {
            setTurn('Lionel');
            setNextTurn('Felix');
        }

        if (storedDate === today) {
            const storedIsChecked = localStorage.getItem('dishIsChecked') === 'true';
            setIsChecked(storedIsChecked);
        } else {
            setIsChecked(false);
        }

        setLoaded(true);
    }, []);

    // Save to localStorage when values change
    useEffect(() => {
        if (!loaded) return;

        const today = new Date().toISOString().split('T')[0];

        localStorage.setItem('dishScheduleState', JSON.stringify({
            turn,
            nextTurn,
            lionelDishes,
            felixDishes,
            isPaused
        }));

        localStorage.setItem('dishIsChecked', isChecked);
        localStorage.setItem('dishCheckedDate', today);
    }, [turn, nextTurn, lionelDishes, felixDishes, isPaused, isChecked, loaded]);

    const GakBisa = () => {
        if (isPaused) return;

        if (turn === 'Lionel') {
            setLionelDishes(prev => prev + 1);
            setTurn('Felix');
            setNextTurn('Lionel');
        } else {
            setFelixDishes(prev => prev + 1);
            setTurn('Lionel');
            setNextTurn('Felix');
        }

        setIsChecked(true);
    };

    const Bisa = () => {
        if (isPaused) return;

        if (turn === 'Lionel') {
            if (lionelDishes > 0) {
                setLionelDishes(prev => prev - 1);
            } else {
                setNextTurn('Felix');
            }
        } else {
            if (felixDishes > 0) {
                setFelixDishes(prev => prev - 1);
            } else {
                setNextTurn('Lionel');
            }
        }

        setIsChecked(true);
    };


    const pause = () => {
        setIsPaused(prev => !prev);
    };

    return (
        <div className="container">
            <div className="card">
                <h1>{isPaused ? '-' : turn}</h1>
            </div>

            {!isChecked ? (
                <div className='Check'>
                    {!isPaused ? (
                        <>
                            <h2>Apakah {turn} tidak bisa cuci piring?</h2>

                            <button onClick={GakBisa}>
                                <AiOutlineClose color="Red" size={20} />
                            </button>

                            <button onClick={Bisa}>
                                <AiOutlineCheck color="Green" size={20} />
                            </button>
                        </>
                    ) : (
                        <h2>Jadwal sedang dijeda</h2>
                    )}

                    <button onClick={pause}>
                        {!isPaused ? (<IoPauseSharp color="Orange" size={20} />) : (<AiOutlineCaretRight color="Orange" size={20} />)}
                    </button>
                </div>
            ) : (
                <div className='Check'>
                    <div className='dishes'>
                        <h2>Besok giliran: <strong>{nextTurn}</strong></h2>
                        <h2>---------------------------------</h2>
                        <h2>Total Penalti</h2>
                        <p>Lionel: {lionelDishes}</p>
                        <p>Felix: {felixDishes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

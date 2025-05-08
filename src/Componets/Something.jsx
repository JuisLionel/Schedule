import '../Style/Something.css';
import React, { useState, useEffect } from 'react';

import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoPauseSharp } from "react-icons/io5";
import { AiOutlineCaretRight } from "react-icons/ai";

import Tanggal from './Tanggal';

const PEOPLE = ['Lionel', 'Felix'];

export default function Something() {
    const getToday = () => new Date().toDateString();
    const [turn, setTurn] = useState('');
    const [nextTurn, setNextTurn] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [felixSkip, setFelixSkip] = useState(0);
    const [lionelSkip, setLionelSkip] = useState(0);
    const [isContinue, setIsContinue] = useState(false);

    const [currentDay, setCurrentDay] = useState(() => {
        const savedDay = localStorage.getItem('savedDay');
        return savedDay || getToday();
    });

    useEffect(() => {
        const checkDayChange = () => {
            const today = getToday();
            if (today !== currentDay) {
                setCurrentDay(today);
                localStorage.setItem('savedDay', today);
    
                if (Notification.permission === "granted") {
                    new Notification(" Friendly Reminder", {
                        body: "Don't forget to fill the data!",
                    });
                }

                if (isPaused == false) {
                    setIsContinue(true);
                }
            }
        };

        checkDayChange();

        const interval = setInterval(checkDayChange, 1 * 1000);
        return () => clearInterval(interval);
    }, [currentDay]);

    useEffect(() => {
        const savedData = localStorage.getItem('dishData');
        if (savedData) {
            const {
                turn,
                nextTurn,
                isChecked,
                isPaused,
                lionelSkip,
                felixSkip
            } = JSON.parse(savedData);

            setTurn(turn);
            setNextTurn(nextTurn);
            setIsChecked(isChecked);
            setIsPaused(isPaused);
            setLionelSkip(lionelSkip);
            setFelixSkip(felixSkip);

        } else {

            setTurn(PEOPLE[0]);
            setNextTurn(PEOPLE[1]);
            setIsChecked(false);
            setIsPaused(false);
            setLionelSkip(0);
            setFelixSkip(0);
        }
    }, []);

    useEffect(() => {
        if (turn && nextTurn) {
            localStorage.setItem(
                'dishData',
                JSON.stringify({
                    turn,
                    nextTurn,
                    isChecked,
                    isPaused,
                    lionelSkip,
                    felixSkip
                })
            );
        }
    }, [turn, nextTurn, isChecked, isPaused, lionelSkip, felixSkip]);

    useEffect(() => {
        if (isContinue) {
            const savedData = localStorage.getItem('dishData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const storedNextTurn = parsed.nextTurn;
                const newNextTurn = storedNextTurn === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];


                if (felixSkip > 0) {
                    setTurn(PEOPLE[1]);
                    setNextTurn(PEOPLE[1]);
                    setIsChecked(false);
                    setIsPaused(false);

                } else if (lionelSkip > 0) {
                    setTurn(PEOPLE[0]);
                    setNextTurn(PEOPLE[0]);
                    setIsChecked(false);
                    setIsPaused(false);

                } else if (lionelSkip == 0 || felixSkip == 0) {
                    setTurn(storedNextTurn);
                    setNextTurn(newNextTurn);
                    setIsChecked(false);
                    setIsPaused(false);
                }
            }

            setIsContinue(false);

        }
    }, [isContinue]);

    const GakBisa = () => {
        if (isPaused) return;

        setTurn(nextTurn);
        setNextTurn(prev => (prev === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0]));
        setIsChecked(true);

        if (turn === PEOPLE[0]) {
            setLionelSkip(lionelSkip + 1);
        } else {
            setFelixSkip(felixSkip + 1);
        }
    };

    const Bisa = () => {
        if (isPaused) return;

        setIsChecked(true);

        if (felixSkip > 0) {
            setFelixSkip(felixSkip - 1);
        } else if (lionelSkip > 0) {
            setLionelSkip(lionelSkip - 1);
        } else {
            setLionelSkip(0);
            setFelixSkip(0);
        }
    };

    const pause = () => {
        setIsPaused(prev => !prev);
    };

    return (
        <div className="container">

            <Tanggal date={currentDay} />
            <div className="card">
                <h2>{turn.toUpperCase()}</h2>
            </div>

            {!isChecked ? (
                <div className='Check'>
                    {!isPaused ? (
                        <>
                            <h2>Apakah {turn} tidak bisa mencuci piring?</h2>

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
            ) : (
                <div className='Check'>
                    <div className='dishes'>
                        <h2>Besok giliran: <strong>{nextTurn}</strong></h2>
                    </div>
                </div>
            )}
        </div>
    );
}
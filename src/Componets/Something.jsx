import '../Style/Something.css';
import { useState, useEffect } from 'react';

import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import Details from './Details';
import Question from './Question';
import Confirmation from './Confirmation';

const PEOPLE = ['Lionel', 'Felix'];

export default function Something() {
    const getToday = () => new Date().toDateString();
    const [turn, setTurn] = useState('');
    const [nextTurn, setNextTurn] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [felixSkip, setFelixSkip] = useState(0);
    const [lionelSkip, setLionelSkip] = useState(0);

    const [Continue, setContinue] = useState(false);
    const [isPrevious, setIsPrevious] = useState(false);

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [ShowConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // NEW

    const [currentDay, setCurrentDay] = useState(() => {
        const savedDay = localStorage.getItem('savedDay');
        return savedDay || getToday();
    });

    useEffect(() => {
        const savedDay = localStorage.getItem('savedDay');
        if (!savedDay) {
            const today = getToday();
            localStorage.setItem('savedDay', today);
            setCurrentDay(today);
        }
    }, []);

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

                if (!isPaused) {
                    setContinue(true);
                }
            }
        };

        checkDayChange();
        const interval = setInterval(checkDayChange, 1000);
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
        if (Continue) {
            const savedData = localStorage.getItem('dishData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const storedNextTurn = parsed.nextTurn;
                const newNextTurn = storedNextTurn === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];

                if (felixSkip > 0) {
                    setTurn(PEOPLE[1]);
                    setNextTurn(PEOPLE[1]);
                } else if (lionelSkip > 0) {
                    setTurn(PEOPLE[0]);
                    setNextTurn(PEOPLE[0]);
                } else {
                    setTurn(storedNextTurn);
                    setNextTurn(newNextTurn);
                }

                setIsChecked(false);
                setIsPaused(false);
            }

            setContinue(false);
        }
    }, [Continue]);

    useEffect(() => {
        if (isPrevious) {
            const savedData = localStorage.getItem('dishData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const storedTurn = parsed.turn;

                const prevTurn = storedTurn === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];
                const prevNextTurn = storedTurn;

                setTurn(prevTurn);
                setNextTurn(prevNextTurn);
                setIsChecked(false);
                setIsPaused(false);
            }

            setIsPrevious(false);
        }
    }, [isPrevious]);

    const GakBisa = () => {
        if (isPaused) return;
        setPendingAction('GakBisa');
        setShowConfirm(true);
    };

    const Bisa = () => {
        if (isPaused) return;
        setPendingAction('Bisa');
        setShowConfirm(true);
    };

    const pause = () => {
        setIsPaused(prev => !prev);
    };

    const handleContinue = () => {
        setContinue(true);
    };

    const handlePrevious = () => {
        setIsPrevious(true);
    };

    const y = () => {
        if (pendingAction === 'GakBisa') {
            if (turn === PEOPLE[0]) {
                setLionelSkip(prev => prev + 1);
            } else {
                setFelixSkip(prev => prev + 1);
            }

            setTurn(nextTurn);
            setNextTurn(prev => (prev === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0]));
            setIsChecked(true);
        }

        if (pendingAction === 'Bisa') {
            if (turn === PEOPLE[0] && lionelSkip > 0) {
                setLionelSkip(prev => prev - 1);
            } else if (turn === PEOPLE[1] && felixSkip > 0) {
                setFelixSkip(prev => prev - 1);
            }

            setIsChecked(true);
        }

        setIsConfirmed(true);
        setShowConfirm(false);
        setPendingAction(null);
    };

    const n = () => {
        setShowConfirm(false);
        setIsConfirmed(false);
        setPendingAction(null);
    };

    return (
        <>
            <div className="container">

                <div className="card">
                    <h2>{turn.toUpperCase()}</h2>
                </div>

                {!isChecked ? (
                    <Question isPaused={isPaused} turn={turn} pause={pause} GakBisa={GakBisa} Bisa={Bisa} />
                ) : (
                    <Details nextTurn={nextTurn} lionelSkip={lionelSkip} felixSkip={felixSkip} />
                )}

                {ShowConfirm && (
                    <Confirmation y={y} n={n} pendingAction={pendingAction}/>
                )}
            </div>

            {/* 
            <div className='continue Check'>
                <button onClick={handlePrevious}>
                    <FaArrowLeft color='white' size={20} />
                </button>

                <button onClick={handleContinue}>
                    <FaArrowRight color="white" size={20} />
                </button>
            </div>
            */}
        </>
    );
}

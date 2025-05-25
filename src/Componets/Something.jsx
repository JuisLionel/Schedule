import '../Style/Something.css';

import { useState, useEffect } from 'react';

import Details from './Details';
import Question from './Question';
import Confirmation from './Confirmation';
import Settings from './Settings';

import { supabase } from './supabaseClient.js';

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

    const [ShowConfirm, setShowConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [currentDay, setCurrentDay] = useState(getToday());
    const [loading, setLoading] = useState(true);

    // Fetch saved data from Supabase on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('dish_data')
                    .select('*')
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') { // 'PGRST116' means no rows found
                    console.error('Error fetching data:', error);
                }

                if (data) {
                    setTurn(data.turn);
                    setNextTurn(data.next_turn);
                    setIsChecked(data.is_checked);
                    setIsPaused(data.is_paused);
                    setLionelSkip(data.lionel_skip);
                    setFelixSkip(data.felix_skip);
                    setCurrentDay(data.current_day || getToday());
                } else {
                    setTurn(PEOPLE[0]);
                    setNextTurn(PEOPLE[1]);
                    setCurrentDay(getToday());
                }
            } catch (err) {
                console.error('Unexpected error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Save to Supabase whenever state changes
    useEffect(() => {
        if (!turn || !nextTurn) return; 

        const saveData = async () => {
            try {
                const { error } = await supabase
                    .from('dish_data')
                    .upsert({
                        id: 'singleton', 
                        current_day: currentDay,
                        turn,
                        next_turn: nextTurn,
                        is_checked: isChecked,
                        is_paused: isPaused,
                        lionel_skip: lionelSkip,
                        felix_skip: felixSkip,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: ['id'] });

                if (error) {
                    console.error('Failed to save data:', error);
                }
            } catch (err) {
                console.error('Unexpected error saving data:', err);
            }
        };

        saveData();
    }, [turn, nextTurn, isChecked, isPaused, lionelSkip, felixSkip, currentDay]);

    // Day change checking with notification
    useEffect(() => {
        const checkDayChange = () => {
            const today = getToday();

            if (today !== currentDay) {
                setCurrentDay(today);

                if (Notification.permission === "granted") {
                    new Notification(" Friendly Reminder", {
                        body: "Don't forget to fill the data!",
                    });
                }

                if (isPaused === false) {
                    setContinue(true);
                }
            }
        };

        checkDayChange();
        const interval = setInterval(checkDayChange, 1000);
        return () => clearInterval(interval);
    }, [currentDay, isPaused]);

    // Handle Continue logic
    useEffect(() => {
        if (Continue) {
            const doContinue = () => {
                if (felixSkip > 0) {
                    setTurn(PEOPLE[1]);
                    setNextTurn(PEOPLE[1]);
                } else if (lionelSkip > 0) {
                    setTurn(PEOPLE[0]);
                    setNextTurn(PEOPLE[0]);
                } else {
                    const newNextTurn = nextTurn === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];
                    setTurn(nextTurn);
                    setNextTurn(newNextTurn);
                }

                setIsChecked(false);
                setIsPaused(false);
            };

            doContinue();
            setContinue(false);
        }
    }, [Continue, felixSkip, lionelSkip, nextTurn]);

    // Handle Previous logic
    useEffect(() => {
        if (isPrevious) {
            const prevTurn = turn === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];
            const prevNextTurn = turn;

            setTurn(prevTurn);
            setNextTurn(prevNextTurn);
            setIsChecked(false);
            setIsPaused(false);

            setIsPrevious(false);
        }
    }, [isPrevious, turn]);

    // Action handlers
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

        setShowConfirm(false);
        setPendingAction(null);
    };

    const n = () => {
        setShowConfirm(false);
        setPendingAction(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Settings handlePrevious={handlePrevious} handleContinue={handleContinue} currentDay={currentDay}/>

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
                    <Confirmation y={y} n={n} pendingAction={pendingAction} />
                )}
            </div>
        </>
    );
}

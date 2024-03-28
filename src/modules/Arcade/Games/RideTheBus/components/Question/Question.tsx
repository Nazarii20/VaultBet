import React, { useEffect, useState } from "react";
import { UserState } from '@declarations/busRide';
// import { Button } from '@mui/material';
import "./Question.css"; // Import your custom CSS file for styling
// import BusAnimation from "./BusAnimation";
import { Token } from '@declarations/busRide';
// import {decimals} from "@utils/validationHelper";

import arrowDown from '@assets/icons/ic-arrow-down.svg';
import arrowTop from '@assets/icons/ic-arrow-top.svg';
import arrowIn from '@assets/icons/ic-arrows-in.svg';
import arrowOut from '@assets/icons/ic-arrows-out.svg';
import blackCircle from '@assets/icons/ic-black-circle.svg';
import redCircle from '@assets/icons/ic-red-circle.svg';
import suitsClubs from '@assets/icons/ic-suits-clubs.svg';
import suitsDiamonds from '@assets/icons/ic-suits-diamonds.svg';
import suitsHeart from '@assets/icons/ic-suits-heart.svg';
import suitsSpades from '@assets/icons/ic-suits-spades.svg';
import TextTitleField from "../TextTitleField/TextTitleField";
import CustomVisibleButtons from "../CustomVisibleButtons/CustomVisibleButtons";
import LostPopup from "../LostPopup/LostPopup";
import ScreenBlur from "../ScreenBlur/ScreenBlur";
import WinPopup from "../WinPopup/WinPopup";

interface Props {
    userState: UserState | undefined;
    setStage: React.Dispatch<React.SetStateAction<string>>;
    handleQuestion: (option: string) => void;
    winningsAmount: number;
    winnings: Token;
    children?: React.ReactChild;
    onSetBetAmount: (value: string) => void;
    onSetAmount: (value: string) => void;
    onSetWinnings: (value: string) => void;
}

type ButtonsType = {
    icon: string;
    title: string;
}

const questionMapper: Record<string, { question: string; description: string; options: ButtonsType[] }> = {
    'red_or_black': {
        'question': 'Red or Black?',
        'description': 'Select either "Red" or "Black" based on your intuition or strategy.',
        'options': [
            { icon: redCircle, title: 'red' },
            { icon: blackCircle, title: 'black' },
        ],
    },
    'between_or_outside': {
        'question': 'Between or Outside?',
        'description': 'Decide if the highlighted card falls between or outside the values of the previous two cards.',
        'options': [
            { icon: arrowIn, title: 'Between' },
            { icon: arrowOut, title: 'Outside' },
        ],

    },
    'higher_or_lower': {
        'question': 'Higher or Lower?',
        'description': 'Decide if the highlighted card will have a value higher or lower than the previous one.',
        'options': [
            { icon: arrowTop, title: 'Higher' },
            { icon: arrowDown, title: 'Lower' },
        ],
    },
    'suits': {
        'question': 'Suit?',
        'description': 'Decide the suit of the upcoming card.',
        'options': [
            { icon: suitsHeart, title: 'hearts' },
            { icon: suitsDiamonds, title: 'diamonds' },
            { icon: suitsClubs, title: 'clubs' },
            { icon: suitsSpades, title: 'spades' },
        ],
    },
};

const Question: React.FC<Props> = ({ 
    userState,
    setStage,
    handleQuestion,
    winningsAmount,
    // winnings,
    children,
    onSetBetAmount,
    onSetAmount,
    onSetWinnings,
}) => {
    const [showScreenBlur, setShowScreenBlur] = useState(false);
    const question = questionMapper[String(userState?.stage)];

    const handleTryAgain = () => {
        setStage("landing");
        onSetBetAmount('0');
        onSetAmount('');
        onSetWinnings('');
    };

    useEffect(() => {
        if (userState?.stage === "end_game_loss" || userState?.stage === "end_game_win") {
                const timeoutId = setTimeout(() => {
            setShowScreenBlur(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
        }
    }, [userState?.stage]);

    const [winningsMoneyAmount, setWinningsMoneyAmount] = useState(winningsAmount);

    useEffect(() => {
        console.log(winningsMoneyAmount);
        setWinningsMoneyAmount(winningsAmount);
    }, [winningsAmount]);

    return (
        <>
            <TextTitleField
                title={question?.question}
                description={question?.description}
            />
            {children}
            {userState?.stage === "end_game_loss" ? (
                    showScreenBlur && (
                        <ScreenBlur>
                            <LostPopup onReset={() => {
                                handleTryAgain();
                                onSetWinnings('');
                            }} />
                        </ScreenBlur>)
                ) : userState?.stage === "end_game_win" ? (
                    showScreenBlur && (
                        <ScreenBlur>
                            <WinPopup
                                money={winningsAmount}
                                onReset={handleTryAgain}
                            />
                        </ScreenBlur>
                    )
                ) : (
                    <div className="ButtonContainer">
                        <CustomVisibleButtons
                            buttons={question?.options || []}
                            onSelect={handleQuestion}
                        />
                    </div>
                )
            } 
        </>
    );
};

export default Question;

import React, { useEffect } from "react";
import { ArcadeGame } from "src/interfaces/arcadeGame";
import { useGameStore } from './store/game'
import './styles/global.css'
import { Game } from './components/Game'

type PlinkoProps = {
    game: ArcadeGame;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Plinko({ game }: PlinkoProps) {
    const alertUser = (e: BeforeUnloadEvent) => {
        if (gamesRunning > 0) {
            e.preventDefault()
            alert('Tu quer mermo sair feladaputa?')
            e.returnValue = ''
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gamesRunning = useGameStore((state: { gamesRunning: any; }) => state.gamesRunning)
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [gamesRunning])
    return <Game />

    //JSX
}

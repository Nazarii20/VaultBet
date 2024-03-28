import create from "zustand";

interface Game {
  gamesRunning: number;
  gameInfo: any[];
  getGameInfo: any;
  setGameInfo: (gInfo: any[]) => void;
  setGamesRunning: (gamesRunning: number) => void;
  incrementGamesRunning: () => void;
  decrementGamesRunning: () => void;
  actor: any;
  getActor: any;
  setActor: (actor: any) => void;
}

export const useGameStore = create<Game>((set, get) => ({
  gamesRunning: 0,
  gameInfo: [],
  getGameInfo: () => {
    return get().gameInfo;
  },
  setGameInfo: (gInfo: any[]) => {
    set({ gameInfo: gInfo });
  },
  setGamesRunning: (gamesRunning: number) => {
    set({ gamesRunning });
  },
  incrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning;
    const calc = gamesRunning + 1;

    set({ gamesRunning: calc < 0 ? 1 : calc });
  },
  decrementGamesRunning: () => {
    const gamesRunning = get().gamesRunning;
    const calc = gamesRunning - 1;

    set({ gamesRunning: calc < 0 ? 0 : calc });
    return calc;
  },
  actor: {},
  getActor: () => {
    return get().actor;
  },
  setActor: (actor: any) => {
    if (typeof actor != "undefined" && Object.keys(actor).length > 0)
      set({ actor });
  },
}));
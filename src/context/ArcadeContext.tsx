// src/subfolder/ArcadeContext.tsx
import React, { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { UserData } from "src/interfaces/arcadeGame";

interface ArcadeContextData {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  currencyDetails: currencyDetails;
  setCurrencyDetails: React.Dispatch<React.SetStateAction<currencyDetails>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  checkBalance: number;
  setCheckBalance: React.Dispatch<React.SetStateAction<number>>;
}

interface currencyDetails {
  displayCurrency: string;
  maxProfit: number;
  maxBet: number;
  precision: number;
}

const ArcadeContext = createContext<ArcadeContextData | undefined>(undefined);

export default function ArcadeContextProvider({children}: PropsWithChildren ) {
  const [currencyDetails, setCurrencyDetails] = useState<currencyDetails>({
    displayCurrency: "ICP",
    maxProfit: 100,
    maxBet: 5,
    precision: 2
  });
  const [currency, setCurrency] = useState<string>("WICP");
  const [userData, setUserData] = useState<UserData>({
		balance: 0,
		principalId: "",
	});
  const [checkBalance, setCheckBalance] = useState(0);

  useEffect(() => {
    if (currency === "CKBTC") {
      setCurrencyDetails({
        displayCurrency: "BTC",
        maxProfit: 0.014,
        maxBet: 0.00068,
        precision: 1
      })
    } else if (currency === "WICP") {
      setCurrencyDetails({
        displayCurrency: "ICP",
        maxProfit: 100,
        maxBet: 5,
        precision: 3
      })
    } else if (currency === "VBT") {
      setCurrencyDetails({
        displayCurrency: "VBT",
        maxProfit: 10_000,
        maxBet: 500,
        precision: 3
      })
    }
  }, [currency])

  return (
    <ArcadeContext.Provider value={{ currency, setCurrency, currencyDetails, setCurrencyDetails, userData, setUserData, checkBalance, setCheckBalance }}>
      {children}
    </ArcadeContext.Provider>
  );
}

export const useArcadeContext = (): ArcadeContextData => {
  const context = useContext(ArcadeContext);
  if (!context) {
    throw new Error('useArcadeContext must be used within an ArcadeContextProvider');
  }
  return context;
};

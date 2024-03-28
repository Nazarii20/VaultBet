import React, { useEffect, useRef, useState } from 'react';
import './BetsPopup.css';
import { Info } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Dialog from '@components/Dialog/Dialog';
import CurrencyDropdown from '@modules/Arcade/arcadeComponents/CurrencyDropdown';
import ArcadeNavbar from '@modules/Arcade/arcadeComponents/ArcadeNavbar';
import { useArcadeContext } from "@context/ArcadeContext";


type BetsPopupProps = {
  betsInput: string | number;
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isBetAmountValid?: boolean;
  errorMessage: string;
}

export default function BetsPopup({ 
  betsInput,
  onChangeInput,
  isBetAmountValid,
  errorMessage
}: BetsPopupProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInput(event);
  };

  const {currency, currencyDetails, setUserData, userData } = useArcadeContext();
  const [maxBetDialogOpen, setmaxBetDialogOpen] = useState(false);

  // const handleClickStartGame = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   // if (event.key === 'Enter') {
  //   //   onStep();
  //   // }
  //   // if (!!betsInput.trim() && event.key === 'Enter') {
  //   //   onStep();
  //   // }
  // };


  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <div className="bets-popup">
      <span className="bets-popup__wallet">
        <div className="bets-popup__balance">
          Balance
        </div>
        <div className="ride-the-bus__navbar-mobile">
          <ArcadeNavbar />
        </div>
      </span>

      <h6 className="bets-popup__title">
        Place your bets
      </h6>

      <div className="bets-popup__input-content">
        <label
          className="bets-popup__label"
          htmlFor="bets-input"
        >
          Bet Amount
          <IconButton size='small' onClick={() => setmaxBetDialogOpen(true)} style={{ color: 'white' }}>
            <Info />
          </IconButton>
          
        </label>
        <Dialog
          open={maxBetDialogOpen}
          onClose={() => setmaxBetDialogOpen(false)}
          title='Max Bet explained'
          content={
            <>
              For liquidity purposes, we have limited the maximum bet to {`${currencyDetails.maxBet} ${currencyDetails.displayCurrency}`} per round. You can bet any amount between 0 and {`${currencyDetails.maxBet}`}. 
              <br />
            </>
          }
			/>
        <div className="bets-popup__input-container">
          <input
            ref={inputRef}
            className="bets-popup__input"
            id="bets-input"
            type="text"
            placeholder="Enter"
            value={betsInput}
            onChange={handleChangeInput}
            // onKeyDown={handleClickStartGame}
          />
          <span className="bets-popup__input-currency">
            <CurrencyDropdown />
          </span>
        </div>

        {isBetAmountValid && <span style={{ color: 'red' }}>{errorMessage}</span>}
      </div>
    </div>
  );
  }

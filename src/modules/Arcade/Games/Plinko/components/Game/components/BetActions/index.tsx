import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import { useAuthStore } from "../../../../store/auth";
import classnames from 'classnames';

import { LinesType } from "../../@types";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useArcadeContext } from "@context/ArcadeContext";
import CurrencyDropdown from "@modules/Arcade/arcadeComponents/CurrencyDropdown";
import { useConnect } from "@connect2ic/react";
import infoIcon from '@assets/icons/ic-info.svg';
import './index.css';

const buttonSx = {
  backgroundColor: "#000000",
  color: "white", // Change the text color to white
  borderRadius: "5px",
  fontSize: "12px",
  "&:hover": { backgroundColor: "#151C26" },
  paddingLeft: "0.2px",
  paddingRight: "0.2px",
};

interface PlinkoBetActions {
  onRunBet?: (betValue: number, nBalls: number) => void;
  onRunOne2OneBet?: (betValue: number, nBalls: number) => void;
  onChangeLines: (lines: LinesType) => void;
  inGameBallsCount: number;
  loader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  gameLoader: boolean;
}

export function BetActions({
  onRunBet,
  onChangeLines,
  inGameBallsCount,
  onRunOne2OneBet,
  loader,
  setLoader,
  gameLoader,
}: PlinkoBetActions) {
  const isLoading = useAuthStore((state) => state.isWalletLoading);
  const currentBalance = useAuthStore((state) => state.wallet.balance);
  const decrementCurrentBalance = useAuthStore(
    (state) => state.decrementBalance
  );
  const [betValue, setBetValue] = useState<number>(0);
  const [ballLimit, setBallLimit] = useState<number>(10);
  const [maxBetDialogOpen, setmaxBetDialogOpen] = useState(false);
  const { currency, currencyDetails, userData } = useArcadeContext();
  const { activeProvider } = useConnect();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isTotalBallsError, setIsTotalBallsError] = useState(false);
  const [nBalls, setNBalls] = useState<number>();
  
  const [currencyPlinkoDetails, setCurrencyPlinkoDetails] = useState<{
    displayCurrency: string;
    maxProfit: number;
    maxBet: number;
    precision: number;
  }>({
    displayCurrency: "ICP",
    maxProfit: 1,
    maxBet: 0.5,
    precision: 1
  })
  const maxLinesQnt = 16;
  const linesOptions: number[] = [];
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i);
  }

  const specificValidateBetAmount = (parsedValue: number) => {
    if (
      !isNaN(parsedValue) &&
      parsedValue >= 0 &&
      parsedValue <= currencyDetails.maxBet &&
      parsedValue <= userData.balance
    ) {
      setErrorMessage("");
    } else if (parsedValue > currencyDetails.maxBet) {
      setErrorMessage(
        `Invalid bet amount, must be between 0 and ${currencyPlinkoDetails.maxBet}`
      );
    } else if (parsedValue > userData.balance) {
      setErrorMessage("Bet amount exceeds balance");
    } else {
      setErrorMessage("Invalid input");
    }
  };

  // const verifyBetAmount = (e: ChangeEvent<HTMLInputElement> | any) => {
  const verifyBetAmount = (text: any) => {
    const numberRegex = /^[0-9]*(\.[0-9]+)?$/; // Regex pattern for a valid number
    let parsedValue;
    setErrorMessage("");
    if (text.match(numberRegex)) {
      parsedValue = parseFloat(text);
      specificValidateBetAmount(parsedValue);
      setBetValue(parsedValue);
    } else if (text === "") {
      parsedValue = 0;
      setBetValue(parsedValue);
    } else {
      setErrorMessage("Invalid input");
    }
  };

  function handleChangeNBallValue(e: ChangeEvent<HTMLInputElement> | any) {
    if (isLoading) return;
    e.preventDefault();
    const value = +e.target.value;
    if (value < 0 || isNaN(value)) return;
    setNBalls(value);

    if (value > 10) {
      setIsTotalBallsError(true);
      setBallLimit(10)
    } else if (value > userData.balance / (betValue || 1)) {
      setIsTotalBallsError(true);
      setBallLimit(Math.floor(userData.balance / (betValue)))
    } else if (value * betValue > currencyDetails.maxBet) {
      setIsTotalBallsError(true);
      setBallLimit(Math.floor(currencyDetails.maxBet / (betValue)))
    }
    else {
      setIsTotalBallsError(false);
      // const newNBalls =
      // value >= userData.balance / (betValue || 1)
      // ? Math.floor(userData.balance / (betValue || 1))
      // : value;
      // setNBalls(newNBalls);
    }
  }

  async function handleRunBet() {
    if (isLoading) return;
    if (
      typeof activeProvider == "undefined" ||
      typeof nBalls == "undefined" ||
      typeof betValue == "undefined"
    )
      return;
    if (inGameBallsCount >= 15 || nBalls <= 0 || betValue <= 0) return;
    if (betValue > userData.balance * nBalls) {
      setBetValue(userData.balance);
      return;
    }
    if (onRunBet) onRunBet(betValue, nBalls);
    if (onRunOne2OneBet) {
      onRunOne2OneBet(betValue, nBalls);
    }
    if (betValue <= 0) return;
    //await decrementCurrentBalance(betValue);
  }

  useEffect(() => {
    if (currency === "CKBTC") {
      setCurrencyPlinkoDetails({
        displayCurrency: "BTC",
        maxProfit: 0.0001,
        maxBet: 0.0001,
        precision: 1
      })
    } else if (currency === "WICP") {
      setCurrencyPlinkoDetails({
        displayCurrency: "ICP",
        maxProfit: 1,
        maxBet: 1,
        precision: 1
      })
    } else if (currency === "VBT") {
      setCurrencyPlinkoDetails({
        displayCurrency: "VBT",
        maxProfit: 100,
        maxBet: 100,
        precision: 2
      })
    }

  }, [currency])

  return (
    <div className="bet-actions-container">
      <Grid
        container
        item
        xs={12}
        direction="row"
        justifyContent="space-between"
      >
        <Typography
          color={"white"}
          variant="subtitle1"
          sx={{ textAlign: "left", fontSize: "14px", display: 'flex', alignItems: 'center' }}
        >
          <span className="bet-actions-title">
            {" "}
            BET AMOUNT PER BALL{" "}
          </span>
          <IconButton
            size="small"
            onClick={() => setmaxBetDialogOpen(true)}
            style={{ color: "white" }}
          >
            <img src={infoIcon} />
          </IconButton>
        </Typography>
      </Grid>
      <Box sx={{ position: "relative" }}>
        <input
          className="bet-amount-input"
          type="number"
          placeholder="Enter"
          onChange={(e) => {
            e.preventDefault;
            verifyBetAmount(e.target.value);
          }}
          value={betValue}
        />
        <span
          className="dialog-currency-dropdown"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <CurrencyDropdown />
        </span>
      </Box>
      <Box
        sx={{
          color: "red",
          zIndex: 1,
          position: "relative",
          marginTop: "5px",
          marginBottom: "5px",
          paddingBottom: "5px",
          textAlign: "left",
        }}
      >
        <Typography>{errorMessage}</Typography>
      </Box>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justifyContent="space-between"
        width="100%"
      >
        <Typography
          color={"white"}
          variant="subtitle1"
          sx={{
            textAlign: "left",
            marginBottom: "5px",
            fontSize: "14px",
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <span className="bet-actions-title" style={{ marginBottom: '5px' }}>
            {" "}
            QUICK BET{" "}
          </span>
          <div className="quick-bet-buttons">
            <button
              className={classnames('quick-bet-button', {
                'quick-bet-button-active': betValue === Number(Number(currencyPlinkoDetails.maxBet / 10).toPrecision(currencyPlinkoDetails.precision)),
              })}
              onClick={
                () =>
                  verifyBetAmount(
                    Number(currencyPlinkoDetails.maxBet / 10).toPrecision(
                      currencyPlinkoDetails.precision
                    )
                  )
              }
            >
              {Number(currencyPlinkoDetails.maxBet / 10).toPrecision(
                currencyPlinkoDetails.precision
              )}
            </button>
            <button
              className={classnames('quick-bet-button', {
                'quick-bet-button-active': betValue === Number(Number(currencyPlinkoDetails.maxBet / 2).toPrecision(currencyPlinkoDetails.precision)),
              })}
              onClick={
                () =>
                  verifyBetAmount(
                    Number(currencyPlinkoDetails.maxBet / 2).toPrecision(
                      currencyPlinkoDetails.precision
                    )
                  )
              }
            >
              {Number(currencyPlinkoDetails.maxBet / 2).toPrecision(
                currencyPlinkoDetails.precision
              )}
            </button>
            <button
              className={classnames('quick-bet-button', {
                'quick-bet-button-active': Number(betValue) === Number(currencyPlinkoDetails.maxBet),
              })}
              onClick={
                () => verifyBetAmount(currencyPlinkoDetails.maxBet.toString())
                // setBetValue(currencyDetails.maxBet)
              }
            >
              {currencyPlinkoDetails.maxBet}
            </button>
          </div>
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        direction="row"
        mt={1}
        justifyContent="space-between"
      >
        <Typography
          color={"white"}
          variant="subtitle1"
          sx={{
            textAlign: "left",
            marginBottom: "5px",
            fontSize: "14px",
            // borderTop: '1px solid #2E323A', 
            // paddingTop: '16px', 
            width: '100%'
          }}
        >
          <span className="bet-actions-title">
            {" "}
            TOTAL BALLS
          </span>
        </Typography>
      </Grid>
      <Box sx={{ position: "relative" }}>
        <input
          className="bet-amount-input"
          placeholder="Enter"
          onChange={(e) => {
            e.preventDefault;
            handleChangeNBallValue(e);
          }}
          value={nBalls}
        />
        {isTotalBallsError && (
          <span style={{ color: 'red', marginTop: 5 }}>Total number of balls cannot exceed {ballLimit}</span>
        )}
      </Box>
      <Grid container item xs={12} mt={2} justifyContent="center">
        {loader ? (
          <CircularProgress size={24} color="warning" />
        ) : gameLoader ? (
          <Button
            size="large"
            sx={{
              backgroundColor: "#CC7F02",
              color: "#FFFFFF",
              textTransform: "none",
              width: "100%",
              borderRadius: "8px",
              fontWeight: 700,
              pointerEvents: "none",
              "&:hover": {
                pointerEvents: "none",
                backgroundColor: "#CC7F02",
              },
            }}
          >
            <Typography style={{ fontWeight: "bold" }}>
              Game in progress..
            </Typography>
          </Button>
        ) : (
          <button
            className={classnames('drop-button', {
              'drop-button-active': betValue && nBalls && errorMessage === ""
            })}
            style={{
              opacity: betValue && nBalls && errorMessage  === "" && !isTotalBallsError ? '1' : '0.4',
              cursor: betValue && nBalls && errorMessage === "" ? 'pointer' : 'not-allowed',
            }}
            onClick={handleRunBet}
            disabled={!betValue || !nBalls || errorMessage !== "" || isTotalBallsError}
          >
            Drop
          </button>
        )}
      </Grid>
      <Dialog
        open={maxBetDialogOpen}
        onClose={() => setmaxBetDialogOpen(false)}
        title="Max Bet explained"
      >
        <Typography p={2} sx={{ backgroundColor: "#2A3748", color: "#FFFFFF" }}>
          For liquidity purposes, we have limited the maximum bet to
          {` ${currencyPlinkoDetails.maxBet} ${currencyDetails.displayCurrency} `}<b>per ball</b> per round.
          Your total bet is your bet amount multiplied by the number of balls you choose to drop,
          and we limit this to {`${currencyDetails.maxBet} ${currencyDetails.displayCurrency}`}, so you can drop up to 10 balls as long as the total value does not
          exceed this. This means your total bet can be any amount between 0 and {`${currencyDetails.maxBet} ${currencyDetails.displayCurrency}`}.
          <br />
        </Typography>
      </Dialog>
    </div>
  );
}
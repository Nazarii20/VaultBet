import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { decimals } from "@utils/validationHelper";
import Dialog from '@components/Dialog/Dialog';
import { useArcadeContext } from "@context/ArcadeContext";
import CurrencyDropdown from 'src/modules/Arcade/arcadeComponents/CurrencyDropdown';
import { Usergeek } from "usergeek-ic-js";
import { useConnect } from "@connect2ic/react";
import mainnetCanisterIds from "@misc/mainnetCanisterIds";
import { useCrashActor } from "src/hooks/useCrashActor";
import { Token } from "@declarations/crash";
import infoIcon from '@assets/icons/ic-info.svg';

interface Props {
  betActive: boolean;
  bBettingPhase: boolean;
  liveMultiplier: string;
  manualCashoutEarly: (token: string | undefined) => void;
  setBetActive: React.Dispatch<React.SetStateAction<boolean>>;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  cashoutMessage: string;
}

const BettingForm: React.FC<Props> = ({
  betActive,
  setBetActive,
  bBettingPhase,
  liveMultiplier,
  manualCashoutEarly,
  betAmount,
  setBetAmount,
  errorMessage,
  setErrorMessage,
  cashoutMessage,
}) => {
  const [isSendingBet, setIsSendingBet] = useState(false);

  const [maxBetDialogOpen, setmaxBetDialogOpen] = useState(false);
  const [maxProfitDialogOpen, setmaxProfitDialogOpen] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const { currency, currencyDetails, setUserData, userData } = useArcadeContext();
  const { activeProvider } = useConnect();
  const [currencyCrashDetails, setCurrencyCrashDetails] = useState<{
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
  const crashCanisterId = mainnetCanisterIds.crashCanisterId;
	const isSmallScreen = useMediaQuery('(max-height:900px)');

  const specificValidateBetAmount = (parsedValue: number) => {
    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue <= currencyDetails.maxBet && parsedValue <= userData.balance) {
      setErrorMessage("");
    } else if (parsedValue > currencyDetails.maxBet) {
      setErrorMessage(`Invalid bet amount, must be between 0 and ${currencyDetails.maxBet}`);
    } else if (parsedValue > userData.balance) {
      setErrorMessage("Bet amount exceeds balance");
    } else {
      setErrorMessage("Invalid input");
    }

  }
  const verifyBetAmount = (text: string) => {
    const numberRegex = /^[0-9]*(\.[0-9]+)?$/; // Regex pattern for a valid number
    let parsedValue;
    setErrorMessage("");
    if (text.match(numberRegex)) {
      parsedValue = parseFloat(text);
      specificValidateBetAmount(parsedValue);
      setBetAmount(parsedValue);
    } else if (text === "") {
      parsedValue = 0;
      setBetAmount(parsedValue);
    } else {
      setErrorMessage("Invalid input");
    }
  };


  const sendBet = async (
    betAmount: number,
    autoCashoutValue: [] | [string] = []
  ) => {
    setIsSendingBet(true);
    if ((betAmount as number) > currencyDetails.maxBet || (betAmount as number) < 0) {
      setErrorMessage(`Invalid bet amount must be between 0 and ${currencyDetails.maxBet}`);
      setIsSendingBet(false);
      return;
    }
    const e8sBetAmount = BigInt(Math.floor(betAmount * decimals));
    console.log("betting", e8sBetAmount, autoCashoutValue);
    try {
      const signedCrashActor = await useCrashActor(
        activeProvider,
        crashCanisterId
      );
      console.log("VALUES", { [currency]: e8sBetAmount }, autoCashoutValue)

      const token = await signedCrashActor.bet({ [currency]: e8sBetAmount } as Token, []);

      const newUserData = { ...userData, token: token }
      setUserData(newUserData);
      Usergeek.trackEvent("Crash Bet Place Success");
      setBetActive(true);
      setErrorMessage("");
      setToken(token);

    } catch (error) {
      console.log(error);
      setErrorMessage("Bet failed, try again!");

    } finally {
      setIsSendingBet(false);
    }
  };

  const handleKeyDownBetting = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (bBettingPhase) {
        console.log("handlekeydown", betAmount);

        sendBet(betAmount);
      }
    }
  };

  const quickBetButtonStyle = {
    width: '100%',
    background: 'rgba(26, 26, 29, 0.80)',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    color: '#8C8C8C',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '20px',
    fontFamily: '"Poppins", sans-serif',
    cursor: 'pointer',
  }

  const betAmountInputStyle = {
    width: 'calc(100% - 20px)',
    paddingBlock: isSmallScreen ? '10px' : '14px',
    paddingLeft: '16px',
    outline: 'none',
    border: '1px solid #2E323A',
    borderRadius: '4px',
    background: 'rgba(26, 26, 29, 0.80)',
    color: '#F9F9F9',
    fontFamily: '"Poppins", sans-serif',
  }

  const bettingTitleStyle = {
    color: '#D1D1D1',
    fontFamily: '"Poppins", sans-serif',
    fontSize: isSmallScreen ? '14px' : '18px',
    fontWeight: '500',
    lineHeight: '22px',
    margin: 0,
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
  }

  useEffect(() => {
    if (currency === "CKBTC") {
      setCurrencyCrashDetails({
        displayCurrency: "BTC",
        maxProfit: 0.00068,
        maxBet: 0.00068,
        precision: 1
      })
    } else if (currency === "WICP") {
      setCurrencyCrashDetails({
        displayCurrency: "ICP",
        maxProfit: 5,
        maxBet: 5,
        precision: 2
      })
    } else if (currency === "VBT") {
      setCurrencyCrashDetails({
        displayCurrency: "VBT",
        maxProfit: 500,
        maxBet: 500,
        precision: 3
      })
    }

  }, [currency])

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(46, 50, 58, 0.70)',
        height: "100%",
        borderRadius: isSmallScreen ? "24px" : "10px",
        padding: isSmallScreen ? "15px" : "20px",
      }}
    >
      <div>
        <h6 style={bettingTitleStyle}>
          {" "}
          BET AMOUNT{" "}
          <button onClick={() => setmaxBetDialogOpen(true)} style={{ 
            color: 'white',
            background: 'none',
            border: 'none',
            }}>
            <img src={infoIcon} />

            </button>
        </h6>
        <div className="bet-amount-input-box">
          <Box sx={{ position: "relative" }}>
            <input
              type="number"
              placeholder="Type Your Bet Amount"
              onChange={(e) => verifyBetAmount(e.target.value)}
              value={betAmount}
              disabled={betActive ? true : false}
              onKeyDown={handleKeyDownBetting}
              style={betAmountInputStyle}
            />
            <span
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
          <Box sx={{ color: "red", zIndex: 1, position: "relative", marginTop: "5px", marginBottom: "10px", paddingBottom: "5px", textAlign: "left" }}>
            {errorMessage}
          </Box>
        </div>
        <div style={{
          textAlign: 'left',
        }}>
          <h1 style={bettingTitleStyle}>QUICK BET</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setBetAmount(Number(Number(currencyCrashDetails.maxBet/5).toPrecision(currencyCrashDetails.precision)))}
              style={quickBetButtonStyle}
            >
              {Number(currencyCrashDetails.maxBet/5).toPrecision(currencyCrashDetails.precision)}
            </button>
            <button
              onClick={() => setBetAmount(Number(Number(currencyCrashDetails.maxBet/2).toPrecision(currencyCrashDetails.precision)))}
              style={quickBetButtonStyle}
            >
              {Number(currencyCrashDetails.maxBet/2).toPrecision(currencyCrashDetails.precision)}
            </button>
            <button
              onClick={() => setBetAmount(currencyCrashDetails.maxBet)}
              style={quickBetButtonStyle}
            >
              {currencyCrashDetails.maxBet}
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            marginTop: '14px',
          }}
        >
          <p style={{ 
            margin: 0,
            color: '#FF403C',
            fontFamily: 'Poppins',
            fontSize: isSmallScreen ? '16px' : '18px',
            fontWeight: '500',
            lineHeight: '22px',
          }}
          >
            Max Profit is {`${currencyDetails.maxProfit} ${currencyDetails.displayCurrency}`}
          </p>
          <button 
            onClick={() => setmaxProfitDialogOpen(true)} 
            style={{ 
              color: 'white',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src={infoIcon} />
          </button>
        </div>
        {isSendingBet ? (
          <div className="bet_btn_loading">
            <CircularProgress size={24} color="warning" />
          </div>
        ) : (
          <>
            {bBettingPhase && !betActive ? (
              <Button
                variant="contained"
                onClick={() => {
                  sendBet(betAmount);
                }}
                sx={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  position: "relative",
                  backgroundColor: "#66E094",
                  color: "#000",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "18px",
                  height: "48px",
                  borderRadius: "8px",
                  width: "100%",
                  "&:hover": { backgroundColor: "#56D184" },
                  border: 'none',
                  outline: 'none',
                }}
              >
                Place Bet
              </Button>
            ) : (
              <>
                {betActive ? (
                  <div>
                    {betActive && Number(liveMultiplier) > 1 ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            manualCashoutEarly(token);
                          }}
                          sx={{
                            marginTop: "10px",
                            paddingTop: "10px",
                            position: "relative",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "18px",
                            backgroundColor: "#00AA25",
                            height: "48px",
                            borderRadius: "8px",
                            width: "100%",
                          }}
                        >
                          {cashoutMessage ? cashoutMessage : `Cashout at ${Number(liveMultiplier)}`}
                        </Button>
                      </>
                    ) : (
                      <span style={{ margin: "10px", fontWeight: 700 }}>
                        Bet Placed
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    {cashoutMessage ? (
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: "10px",
                          paddingTop: "10px",
                          position: "relative",
                          backgroundColor: "#3CA1FF",
                          color: "#000",
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "18px",
                          height: "48px",
                          borderRadius: "8px",
                          width: "100%",
                          "&:hover": {
                            backgroundColor: "#3CA1FF",
                          },
                        }}
                      >
                        {cashoutMessage}
                      </Button>
                    ) : (
                      <button
                        disabled={true}
                        style={{
                          outline: "none",
                          border: "none",
                          marginTop: "10px",
                          position: "relative",
                          backgroundColor: "#3CA1FF",
                          color: "#000",
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "18px",
                          height: "48px",
                          borderRadius: "8px",
                          width: "100%",
                          opacity: "0.8",
                          cursor: 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Wait For Next Round
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Dialog
        open={maxProfitDialogOpen}
        onClose={() => setmaxProfitDialogOpen(false)}
        title='Max Profit explained'
        content={
          <>
            For liquidity purposes, we have limited the maximum profit each player can reach to {`${currencyDetails.maxProfit} ${currencyDetails.displayCurrency}`} per Crash round.
            <br />
            <br />
            <br />
            For example, if you bet {`${currency === "WICP" ? "1" : "0.00014"} ${currencyDetails.displayCurrency}`} you will be notified that you have hit max profit when the multiplier hits 100x. At this time, you can ‘Cashout’ and your balance will increase by {`${currencyDetails.maxProfit} ${currency}`} If you do not hit ‘Cashout’ by the time a crash occurs, you will lose your bet amount, regardless of whether max profit was acheived or not.
            <br />
          </>
        }
      />
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
    </Box>
  );
};

export default BettingForm;

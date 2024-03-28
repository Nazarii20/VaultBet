import React, { useState } from "react";
import { UserState } from '@declarations/busRide';
import { decimals } from "@utils/validationHelper";
import { useArcadeContext } from "@context/ArcadeContext";
import { Token } from '@declarations/busRide';
import BetsPopup from "../BetsPopup/BetsPopup";
import CustomButton from "../CustomButton/CustomButton";
import './BettingForm.css';
import { Usergeek } from "usergeek-ic-js";
import TextTitleField from "../TextTitleField/TextTitleField";
import { panelsDark } from "../../utils/variables";
import Loader from "../Loader/Loader";


interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signedBusRideActor: any;
  setUserState: React.Dispatch<React.SetStateAction<UserState | undefined>>;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  handleQuestion: (option: string) => void;
  betAmount: string,
  onSetBetAmount: (value: string) => void;
  onSetAmount: (value: string) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const BettingForm: React.FC<Props> = ({
  signedBusRideActor,
  setUserState,
  setStage,
  betAmount,
  onSetBetAmount,
  errorMessage,
  setErrorMessage,
  onSetAmount,
}) => {
  const [isBetAmountValid, setIsBetAmountValid] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);
  const { currency, currencyDetails, setUserData, userData } = useArcadeContext();


  const handleBetAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = /^\d+$/;

    // console.log("value: " + Number(value) + "\nmaxBet: " + currencyDetails.maxBet + "\nbalance: " + userData.balance)

    const inputBetAmount = Number(value);
    onSetBetAmount(value);

    if (value === '' || inputBetAmount === 0 || !regex.test(value)) {
      setIsBetAmountValid(false);
    }

    verifyBetAmount(value)
  };

  const specificValidateBetAmount = (parsedValue: number) => {
    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue <= currencyDetails.maxBet && parsedValue <= userData.balance) {
      setErrorMessage("");
      setIsBetAmountValid(true);
    } else if (parsedValue > currencyDetails.maxBet) {
      setIsBetAmountValid(false);
      setErrorMessage(`Invalid bet amount, must be between 0 and ${currencyDetails.maxBet}`);
    } else if (parsedValue > userData.balance) {
      setIsBetAmountValid(false);
      setErrorMessage("Bet amount exceeds balance");
    } else {
      setIsBetAmountValid(false);
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
    } else if (text === "") {
      parsedValue = 0;
    } else {
      setErrorMessage("Invalid input");
    }
  };


  const handleStartGame = async () => {
    setLoadingGame(true);
    try {
      const sendThis = { [currency]: BigInt(Math.floor(Number(Number(betAmount) * decimals))) };
      const init_response = await signedBusRideActor.place_bet(sendThis as Token);
      setUserData(prev => ({ ...prev, balance: userData.balance - Number(betAmount) }));
      // console.log(userData.balance - Number(betAmount));
      setUserState(init_response)
      setStage(init_response.stage);
      onSetAmount(betAmount,);
    } catch (error) {
      console.error("Error starting game:", error);
      setErrorMessage('Bet failed. Please try again.')
    } finally {
      Usergeek.trackEvent("Ride the Bus Bet Place Success");
      setLoadingGame(false);
    }
  };

  return (
    <>
      <section className="playing-field">
        <div className="playing-field__inner">
          {loadingGame && (
            <div className="game-loader" style={{ zIndex: '10000' }}>
              <span style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)' }}>
                <Loader />
              </span>
            </div>
          )}
          <TextTitleField
            title="ride the bus!"
            description="Enter the amount you wish to bet."
          />

          <BetsPopup
            betsInput={betAmount}
            onChangeInput={handleBetAmountChange}
            isBetAmountValid={!isBetAmountValid}
            errorMessage={errorMessage}
          />

          <CustomButton
            backgroundColor={panelsDark}
            isDisabled={!isBetAmountValid}
            isBorderExist={true}
            paddingBlockMobile="16"
            borderRadiusMobile="8"
            onClick={handleStartGame}
          >
            Let’s Play!
          </CustomButton>
        </div>
      </section>
    </>
  );
}

export default BettingForm;

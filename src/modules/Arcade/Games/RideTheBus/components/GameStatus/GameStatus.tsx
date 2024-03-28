import React from 'react';
import CustomStatusField from '../CustomStatusField/CustomStatusField'
import CustomButton from '../CustomButton/CustomButton';
import './GameStatus.css';
import { systemPositiveDefault, systemPositiveHover, textBlack } from '../../utils/variables';

type GameStatusProps = {
  winnings: string;
  betsInput: string;
  isDisabledButton: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function GameStatus({
  winnings,
  betsInput,
  isDisabledButton,
  onClick,
  // onClose,
}: GameStatusProps) {
  return (
    <section className="status-field">
      <div className="status-field__current">
        <CustomStatusField title="Your Bet" text={betsInput} disabled={isDisabledButton} />
        <CustomStatusField title="winnings" text={winnings} disabled={isDisabledButton} />
      </div>
      <span className="status-field__button">
        <CustomButton
          isBorderExist={true}
          isDisabled={isDisabledButton}
          onClick={onClick}
          backgroundColor={systemPositiveDefault}
          color={textBlack}
          backgroundColorHover={systemPositiveHover}
        >
          Cash Out
        </CustomButton>
      </span>
    </section>
  )
}

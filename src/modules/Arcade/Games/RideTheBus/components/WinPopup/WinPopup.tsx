import React from 'react';
import closeIcon from '../../../../../../assets/icons/ic-close.svg';
import CustomButton from '../CustomButton/CustomButton';
import { systemPositiveDefault, systemPositiveHover, textBlack } from '../../utils/variables';
import bigPot from '@assets/images/pot-big.png';
import './WinPopup.css';
import { useArcadeContext } from "@context/ArcadeContext";


type LostPopupProps = {
  money: number;
  onReset?: () => void;
  onClick?: () => void;
}

export default function WinPopup({ money, onReset }: LostPopupProps) {

  const { currency } = useArcadeContext();

  return (
    <div className="win-popup">
      <button className="win-popup__button-close" onClick={onReset}>
        <img src={closeIcon} />
      </button>

      <span>
        <img className="win-popup__icon" src={bigPot} alt="win icon" />
      </span>

      <p className="win-popup__desc">You WON</p>

      <span className="win-popup__buttons">
        <div className="win-popup__money">{currency === "VBT" ? ((money / 100) + " ICP") : (currency === "WICP" ? money + " ICP" : money + " " + currency)}</div>
        {currency === "VBT" ?
          <div>VBT Winnings returned in ICP, check ICP balance</div>
          :
          null
        }
        <CustomButton
          backgroundColor={systemPositiveDefault}
          backgroundColorHover={systemPositiveHover}
          color={textBlack}
          onClick={onReset}
        >
          Try again
        </CustomButton>
      </span>
    </div>
  );
}

import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import { systemPositiveDefault, systemPositiveHover, textBlack } from '../../utils/variables';
import iconClose from '../../../../../../assets/icons/ic-close.svg';
import './CashOutPopup.css';

type CashOutPopupProps = {
  money: number;
  onClick: () => void;
  onClose: () => void;
}

export default function CashOutPopup({ money, onClick, onClose }: CashOutPopupProps) {
  return (
    <div className="cash-out-popup">
      <div className="cash-out-popup__top">
        <h6 className="cash-out-popup__title">Cash Out</h6>
        <button className="cash-out-popup__button-close" onClick={onClose}>
          <img src={iconClose} />
        </button>
      </div>

      <p className="cash-out-popup__desc">
        {'Are you sure you want to cashout now? Click Cancel to keep playing or Cashout to secure current winnings.'}
      </p>

      <div className="cash-out-popup__money">{money}</div>
      
      <div className="cash-out-popup__buttons">
        <CustomButton isBorderExist={true} onClick={onClose}>
          Cancel
        </CustomButton>

        <CustomButton
          backgroundColor={systemPositiveDefault}
          backgroundColorHover={systemPositiveHover}
          color={textBlack}
          onClick={onClick}
        >
          Cash Out
        </CustomButton>
      </div>
    </div>
  )
}

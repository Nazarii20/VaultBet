import React from 'react';
import arrowDown from '../../../../../../assets/icons/ic-arrow-down.svg';
import icpIcon from '../../../../../../assets/images/icp-ic.png';
import './MoneyState.css';

export default function MoneyState() {
  return (
    <div className="money-state">
      <div className="money-state__content">
        <img className="money-state__img" src={icpIcon} alt="icp icon" />
        <span className="money-state__text">ICP</span>
        <button className="money-state__button">
          <img src={arrowDown} alt="arrow down" />
        </button>
      </div>

      <span className="money-state__currency">1,523.01</span>
    </div>
  );
}

import React from 'react'
import CustomButton from '../CustomButton/CustomButton';
import lost1 from '../../../../../../assets/images/lost1.png';
import lost2 from '../../../../../../assets/images/lost2.png';
import lost3 from '../../../../../../assets/images/lost3.png';
import lost4 from '../../../../../../assets/images/lost4.png';
import lost5 from '../../../../../../assets/images/lost5.png';
import closeIcon from '../../../../../../assets/icons/ic-close.svg';
import './LostPopup.css';

type LostPopupProps = {
  onReset: () => void;
}

export default function LostPopup({ onReset }: LostPopupProps) {
  const lostIcons = [
    lost1,
    lost2,
    lost3,
    lost4,
    lost5,
  ];

  const randomIconNumber = Math.floor(Math.random() * lostIcons.length);

  return (
    <div className="lost-popup">
      <button className="lost-popup__button-close" onClick={onReset}>
        <img src={closeIcon} />
      </button>

      <img className="lost-popup__icon" src={lostIcons[randomIconNumber]} alt="lost icon" />

      <p className="lost-popup__desc">You LOST</p>

      <span className="lost-popup__button" onClick={onReset}>
        <CustomButton isBorderExist={true}>
          Try Again
        </CustomButton>
      </span>
    </div>
  );
}

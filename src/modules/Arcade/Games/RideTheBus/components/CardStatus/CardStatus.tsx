import React from 'react';
import './CardStatus.css';
import { useArcadeContext } from '@context/ArcadeContext';
import doneIcon from '@assets/icons/ic-done.svg';

type CardStatusProps = {
  x: number;
  icp: number;
  isDone: boolean | undefined;
}

export default function CardStatus({ x, icp, isDone }: CardStatusProps) {
  const { currencyDetails } = useArcadeContext();

  return (
    <div className="card-status">
      <span className="card-status__x">X {x}</span>
      <span className="card-status__s">=</span>
      <span className='card-status__currency'>
        {`${icp.toString().slice(0,7)} ${currencyDetails.displayCurrency}`}
        {isDone && <img src={doneIcon} alt='icon done' />}
      </span>
    </div>
  );
}

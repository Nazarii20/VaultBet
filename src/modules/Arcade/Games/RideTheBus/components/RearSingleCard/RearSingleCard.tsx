import React from 'react';
import rearIcon from '../../../../../../assets/icons/ic-rear-card.svg';
import './rearSingleCard.css';

export default function RearSingleCard() {
  
  return (
    <article className='rear-single-card'>
      <div className="rear-single-card__inner">
        <img className="rear-single-card__icon" src={rearIcon} />
      </div>
    </article>
  )
}

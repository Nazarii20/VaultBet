import React from 'react';
import clubs2 from '@assets/images/cards/clubs-2.png';
import clubs3 from '@assets/images/cards/clubs-3.png';
import clubs4 from '@assets/images/cards/clubs-4.png';
import clubs5 from '@assets/images/cards/clubs-5.png';
import clubs6 from '@assets/images/cards/clubs-6.png';
import clubs7 from '@assets/images/cards/clubs-7.png';
import clubs8 from '@assets/images/cards/clubs-8.png';
import clubs9 from '@assets/images/cards/clubs-9.png';
import clubs10 from '@assets/images/cards/clubs-10.png';
import clubsJ from '@assets/images/cards/clubs-J.png';
import clubsQ from '@assets/images/cards/clubs-Q.png';
import clubsK from '@assets/images/cards/clubs-K.png';
import clubsA from '@assets/images/cards/clubs-A.png';

import spades2 from '@assets/images/cards/spades-2.png';
import spades3 from '@assets/images/cards/spades-3.png';
import spades4 from '@assets/images/cards/spades-4.png';
import spades5 from '@assets/images/cards/spades-5.png';
import spades6 from '@assets/images/cards/spades-6.png';
import spades7 from '@assets/images/cards/spades-7.png';
import spades8 from '@assets/images/cards/spades-8.png';
import spades9 from '@assets/images/cards/spades-9.png';
import spades10 from '@assets/images/cards/spades-10.png';
import spadesJ from '@assets/images/cards/spades-J.png';
import spadesQ from '@assets/images/cards/spades-Q.png';
import spadesK from '@assets/images/cards/spades-K.png';
import spadesA from '@assets/images/cards/spades-A.png';

import hearts2 from '@assets/images/cards/hearts-2.png';
import hearts3 from '@assets/images/cards/hearts-3.png';
import hearts4 from '@assets/images/cards/hearts-4.png';
import hearts5 from '@assets/images/cards/hearts-5.png';
import hearts6 from '@assets/images/cards/hearts-6.png';
import hearts7 from '@assets/images/cards/hearts-7.png';
import hearts8 from '@assets/images/cards/hearts-8.png';
import hearts9 from '@assets/images/cards/hearts-9.png';
import hearts10 from '@assets/images/cards/hearts-10.png';
import heartsJ from '@assets/images/cards/hearts-J.png';
import heartsQ from '@assets/images/cards/hearts-Q.png';
import heartsK from '@assets/images/cards/hearts-K.png';
import heartsA from '@assets/images/cards/hearts-A.png';

import diamonds2 from '@assets/images/cards/diamonds-2.png';
import diamonds3 from '@assets/images/cards/diamonds-3.png';
import diamonds4 from '@assets/images/cards/diamonds-4.png';
import diamonds5 from '@assets/images/cards/diamonds-5.png';
import diamonds6 from '@assets/images/cards/diamonds-6.png';
import diamonds7 from '@assets/images/cards/diamonds-7.png';
import diamonds8 from '@assets/images/cards/diamonds-8.png';
import diamonds9 from '@assets/images/cards/diamonds-9.png';
import diamonds10 from '@assets/images/cards/diamonds-10.png';
import diamondsJ from '@assets/images/cards/diamonds-J.png';
import diamondsQ from '@assets/images/cards/diamonds-Q.png';
import diamondsK from '@assets/images/cards/diamonds-K.png';
import diamondsA from '@assets/images/cards/diamonds-A.png';

import joker from '@assets/images/cards/Joker-red.png';

import iconDone from '@assets/icons/ic-done.svg';

import './PlayingCard.css';

type PlayingCardProps = {
  rank: number;
  suit: string | undefined;
  isDone?: boolean;
}

export default function PlayingCard({ rank, suit, isDone }: PlayingCardProps) {
  const deck = [
    {rank: 2, suit: 'hearts', image: hearts2},
    {rank: 2, suit: 'diamonds', image: diamonds2},
    {rank: 2, suit: 'clubs', image: clubs2},
    {rank: 2, suit: 'spades', image: spades2},
    {rank: 3, suit: 'hearts', image: hearts3},
    {rank: 3, suit: 'diamonds', image: diamonds3},
    {rank: 3, suit: 'clubs', image: clubs3},
    {rank: 3, suit: 'spades', image: spades3},
    {rank: 4, suit: 'hearts', image: hearts4},
    {rank: 4, suit: 'diamonds', image: diamonds4},
    {rank: 4, suit: 'clubs', image: clubs4},
    {rank: 4, suit: 'spades', image: spades4},
    {rank: 5, suit: 'hearts', image: hearts5},
    {rank: 5, suit: 'diamonds', image: diamonds5},
    {rank: 5, suit: 'clubs', image: clubs5},
    {rank: 5, suit: 'spades', image: spades5},
    {rank: 6, suit: 'hearts', image: hearts6},
    {rank: 6, suit: 'diamonds', image: diamonds6},
    {rank: 6, suit: 'clubs', image: clubs6},
    {rank: 6, suit: 'spades', image: spades6},
    {rank: 7, suit: 'hearts', image: hearts7},
    {rank: 7, suit: 'diamonds', image: diamonds7},
    {rank: 7, suit: 'clubs', image: clubs7},
    {rank: 7, suit: 'spades', image: spades7},
    {rank: 8, suit: 'hearts', image: hearts8},
    {rank: 8, suit: 'diamonds', image: diamonds8},
    {rank: 8, suit: 'clubs', image: clubs8},
    {rank: 8, suit: 'spades', image: spades8},
    {rank: 9, suit: 'hearts', image: hearts9},
    {rank: 9, suit: 'diamonds', image: diamonds9},
    {rank: 9, suit: 'clubs', image: clubs9},
    {rank: 9, suit: 'spades', image: spades9},
    {rank: 10, suit: 'hearts', image: hearts10},
    {rank: 10, suit: 'diamonds', image: diamonds10},
    {rank: 10, suit: 'clubs', image: clubs10},
    {rank: 10, suit: 'spades', image: spades10},
    {rank: 11, suit: 'hearts', image: heartsJ},
    {rank: 11, suit: 'diamonds', image: diamondsJ},
    {rank: 11, suit: 'clubs', image: clubsJ},
    {rank: 11, suit: 'spades', image: spadesJ},
    {rank: 12, suit: 'hearts', image: heartsQ},
    {rank: 12, suit: 'diamonds', image: diamondsQ},
    {rank: 12, suit: 'clubs', image: clubsQ},
    {rank: 12, suit: 'spades', image: spadesQ},
    {rank: 13, suit: 'hearts', image: heartsK},
    {rank: 13, suit: 'diamonds', image: diamondsK},
    {rank: 13, suit: 'clubs', image: clubsK},
    {rank: 13, suit: 'spades', image: spadesK},
    {rank: 1, suit: 'hearts', image: heartsA},
    {rank: 1, suit: 'diamonds', image: diamondsA},
    {rank: 1, suit: 'clubs', image: clubsA},
    {rank: 1, suit: 'spades', image: spadesA},
    {rank: 14, suit: 'joker_black', image: joker},
    {rank: 14, suit: 'joker_red', image: joker},
  ];

  function findCard() {
    return deck.find(card => card.rank === rank && card.suit === suit);
  }

  const currentCard = findCard()?.image;
  const description = `${findCard()?.suit} ${findCard()?.rank}`

  return (
    <div className="playing-card__container">
      <img className="playing-card" width={200} height={298} src={currentCard} alt={description} />
      {isDone && (
        <span className="playing-card__done-container">
          <img className="playing-card__done-icon" src={iconDone} alt="icon done" />
        </span>
      )}
    </div>
  )
}

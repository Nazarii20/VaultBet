import React from "react";
import {UserState} from '@declarations/busRide';
import {decimals} from "@utils/validationHelper";

import RearSingleCard from "../RearSingleCard/RearSingleCard";
import PlayingCard from "../PlayingCard/PlayingCard";
import ReactCardFlip from "react-card-flip";
import CardStatus from "../CardStatus/CardStatus";
import { baseOpacity, disabledOpacity } from "../../utils/variables";
import "./PlayingCards.css";

interface Props {
  userState: UserState | undefined;
}

const multipliers: Record<string, number> = {
  "red_or_black": 2,
  "higher_or_lower": 1.5 * 2,
  "between_or_outside": 1.5 * 1.5 * 2,
  "suits": 4 * 1.5 * 1.5 * 2
};

const multipliersValues: Record<string, number> = {
  "red_or_black": 2,
  "higher_or_lower": 1.5,
  "between_or_outside": 1.5,
  "suits": 4,
};

const PlayingCards: React.FC<Props> = ({ userState }) => {
  const betAmount = Number(Object.values({...userState?.token})[0]) / decimals;

  // console.log(betAmount, multipliers[userState?.stage]);

  return (
    <>
      <span className="playing-card__card-status-mobile">
        {userState?.stage && userState?.stage !== 'end_game_loss' && (
          <CardStatus
            x={multipliersValues[userState?.stage]}
            icp={betAmount * multipliers[userState?.stage]}
            isDone={false}
          />
        )}
      </span>

      <div className="playing-cards">
        <span style={{ opacity: userState && userState.deck.length <= 54 ? baseOpacity : disabledOpacity }}>
          <span className="playing-card__card-status">
            <CardStatus
              x={multipliersValues["red_or_black"]}
              // icp={betAmount * multipliers["red_or_black"]}
              icp={betAmount * multipliers["red_or_black"]}
              isDone={userState && userState.deck.length <= 53 && userState.stage !== 'end_game_loss'}
            />
          </span>

          <ReactCardFlip isFlipped={Number(userState?.cards.card_1.rank) === 0} flipDirection="horizontal">
            <PlayingCard 
              rank={Number(userState?.cards.card_1.rank)}
              suit={userState?.cards.card_1.suit}
              isDone={userState && userState.deck.length <= 53 && userState.stage !== 'end_game_loss'}
            />
            <RearSingleCard />
          </ReactCardFlip>
        </span>

        <span style={{ opacity: userState && userState.deck.length <= 53 ? baseOpacity : disabledOpacity }}>
          <span className="playing-card__card-status">
            <CardStatus 
              x={multipliersValues["higher_or_lower"]}
              icp={betAmount * multipliers["higher_or_lower"]}
              isDone={userState && userState.deck.length <= 52 && userState.stage !== 'end_game_loss'}
            />
          </span>

          <ReactCardFlip isFlipped={Number(userState?.cards.card_2.rank) === 0} flipDirection="horizontal">
            <PlayingCard 
              rank={Number(userState?.cards.card_2.rank)}
              suit={userState?.cards.card_2.suit}
              isDone={userState && userState.deck.length <= 52 && userState.stage !== 'end_game_loss'}
            />
            <RearSingleCard />
          </ReactCardFlip>
        </span>

        <span style={{ opacity: userState && userState.deck.length <= 52 ? baseOpacity : disabledOpacity }}>
          <span className="playing-card__card-status">
            <CardStatus 
              x={multipliersValues["between_or_outside"]}
              icp={betAmount * multipliers["between_or_outside"]}
              isDone={userState && userState.deck.length <= 51 && userState.stage !== 'end_game_loss'}
            />
          </span>

          <ReactCardFlip isFlipped={Number(userState?.cards.card_3.rank) === 0} flipDirection="horizontal">
            <PlayingCard 
              rank={Number(userState?.cards.card_3.rank)}
              suit={userState?.cards.card_3.suit}
              isDone={userState && userState.deck.length <= 51 && userState.stage !== 'end_game_loss'}
            />
            <RearSingleCard />
          </ReactCardFlip>
        </span>

        <span style={{ opacity: userState && userState.deck.length <= 51 ? baseOpacity : disabledOpacity }}>
          <span className="playing-card__card-status">
            <CardStatus 
              x={multipliersValues["suits"]}
              icp={betAmount * multipliers["suits"]}
              isDone={userState && userState.deck.length <= 50 && userState.stage !== 'end_game_loss'}
            />
          </span>

          <ReactCardFlip isFlipped={Number(userState?.cards.card_4.rank) === 0} flipDirection="horizontal">
            <PlayingCard 
              rank={Number(userState?.cards.card_4.rank)}
              suit={userState?.cards.card_4.suit}
              isDone={userState && userState.deck.length <= 50 && userState.stage !== 'end_game_loss'}
            />
            <RearSingleCard />
          </ReactCardFlip>
        </span>
      </div>
    </>
  );
};

export default PlayingCards;

import React from 'react';
import './EntertainmentCard.css';

type EntertainmentCardType = {
  title: string,
  description: string,
  buttonText: string,
  imageBg: string,
  link: string,
  onHandleChooseTab: () => void;
}

export default function EntertainmentCard({
  title,
  description,
  buttonText,
  imageBg,
  onHandleChooseTab,
}: EntertainmentCardType) {
  return (
    <article className="entertainment-card">
      <span className="entertainment-card__gradient"></span>
      <img className="entertainment-card__img" src={imageBg} />
      <h3 className="entertainment-card__title">{title}</h3>
      <p className="entertainment-card__description">{description}</p>
      <button className="entertainment-card__buttonText" onClick={onHandleChooseTab}>{buttonText}</button>
    </article>
  )
}

import React from 'react';
import { baseOpacity, disabledOpacity } from '../../utils/variables';
import './CustomStatusField.css';
import { useArcadeContext } from '@context/ArcadeContext';

type CustomStatusFieldProps = {
  title: string,
  text: string,
  disabled?: boolean,
};

export default function CustomStatusField({ title, text, disabled }: CustomStatusFieldProps) {
  const articleStyle = {
    opacity: disabled ? disabledOpacity : baseOpacity,
  }
  const { currencyDetails } = useArcadeContext();

  const renderText = () => {
    if (isNaN(Number(text)) || !text.trim()) {
      return '-';
    } else {
      return `${text} ${currencyDetails.displayCurrency}`;
    }
  }

  return (
    <article className="custom-status-field" style={articleStyle}>
      <h5 className="custom-status-field__title">{title}</h5>
      <span className="custom-status-field__text">{renderText()}</span>
    </article>
  );
}

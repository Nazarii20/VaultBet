import React from 'react';
import './TextTitleField.css';

type TextTitleFieldProps = {
  title: string;
  description: string;
}

export default function TextTitleField({ title, description }: TextTitleFieldProps) {
  return (
    <div className="text-title-field__info">
      <h3 className="text-title-field__title">{title}</h3>
      <p className="text-title-field__desc">{description}</p>
    </div>
  );
}

import React, { Fragment } from 'react';
import CustomButton from '../CustomButton/CustomButton';
import './CustomVisibleButtons.css'

type ButtonsType = {
  icon: string;
  title: string;
}

type VisibleButtonsProps = {
  buttons: ButtonsType[];
  onClick?: () => void;
  onSelect?: (value: string) => void;
}

export default function CustomVisibleButtons({ buttons, onClick, onSelect }: VisibleButtonsProps) {
  return (
    <div className="custom-visible-buttons">
      {buttons.map((button) => (
        <Fragment key={button.title}>
          <CustomButton onClick={() => {
            if (onClick) {
              onClick();
            }
            
            if (onSelect) {
              onSelect(button.title);
            }
          }} 
          isBorderExist={true}
          paddingBlockMobile='16'
          paddingInlineMobile='24'
          >
            <div className="custom-visible-buttons__inner">
              <img
                className="custom-visible-buttons__icon"
                src={button.icon}
                alt="icon button"
              />

              <span className="custom-visible-buttons__title">
                {`${button.title[0].toUpperCase()}${button.title.slice(1)}`}
              </span>
            </div>
          </CustomButton>
        </Fragment>
      ))}
    </div>
  );
}

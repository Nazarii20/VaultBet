import React, { useState, useEffect } from 'react';
import { baseOpacity, disabledOpacity, textWhite } from '../../utils/variables';
import './CustomButton.css';

type ButtonProps = {
  children: React.ReactChild,
  color?: string,
  backgroundColor?: string,
  backgroundColorHover?: string,
  paddingBlock?: string,
  paddingBlockMobile?: string,
  paddingInline?: string,
  paddingInlineMobile?: string,
  borderRadius?: string,
  borderRadiusMobile?: string,
  isBorderExist?: boolean,
  isDisabled?: boolean,
  fontSizeMobile?: string,
  onClick?: () => void;
};

export default function CustomButton({
  children,
  color,
  backgroundColor,
  backgroundColorHover,
  paddingBlock,
  paddingBlockMobile,
  paddingInline,
  paddingInlineMobile,
  borderRadius,
  borderRadiusMobile,
  isBorderExist,
  isDisabled,
  fontSizeMobile,
  onClick,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isBorderColorExist = isHovered && isBorderExist && !isDisabled;
  const isBackgroundHoverExist = isHovered && backgroundColorHover;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const buttonStyle = {
    color: color,
    backgroundColor: isBackgroundHoverExist ? backgroundColorHover : backgroundColor,
    paddingBlock: windowWidth < 940 ? `${paddingBlockMobile}px` : `${paddingBlock}px`,
    paddingInline: windowWidth < 940 ? `${paddingInlineMobile}px` : `${paddingInline}px`,
    borderRadius: windowWidth < 940 ? `${borderRadiusMobile}px` : `${borderRadius}px`,
    opacity: isDisabled ? disabledOpacity : baseOpacity,
    borderColor: isBorderColorExist ? textWhite : 'transparent',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: windowWidth < 940 ? `${fontSizeMobile}px` : '18px',
  };

  return (
    <button
      className="button"
      style={buttonStyle}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

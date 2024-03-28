import React from 'react';
import './ScreenBlur.css';

type ScreenBlurProps = {
  children: React.ReactChild;
};

export default function ScreenBlur({ children }: ScreenBlurProps) {
  return (
    <div className="screen-blur">
      {children}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import currenciesImg from '@assets/images/main-currency-img.png';
import currenciesImgMobile from '@assets/images/main-currency-img-mobile.png';
import './HeroSection.css';

export default function HeroSection() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const imageSrc = windowWidth < 900 ? currenciesImgMobile : currenciesImg;

  return (
    <div className="hero-section">
      <span className="hero-section__gradient" />
      <div className="hero-section__left">
        <h1 className="hero-section__title">
          Premier <br />
          On-Chain Betting 
        </h1>

        <p className="hero-section__description">
          <span className="hero-section__description-title">VaultBet </span>
          - Redefining online betting on the Internet Computer. <br />
          Experience transparency, security, and community-driven gambling like never before.
        </p>
      </div>

      <img 
        className="hero-section__img"
        src={imageSrc}
        alt="currencies image"
      />
    </div>
  )
}

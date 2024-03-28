import React from 'react';
import './Footer.css';
// import twitter from '@assets/icons/ic-twitter.svg';
// import discord from '@assets/icons/ic-discord.svg';
import discord from '@assets/icons/ic-discord.svg';
import twitter from '@assets/icons/icons8-twitter.svg';
import logo from '@assets/icons/ic-logo.svg';
import email from '@assets/icons/ic-email.svg';
import useGlobal from 'src/hooks/useGlobal';
import { TabType } from '@components/HomeTabs/HomeTabs';
import { Link } from 'react-router-dom';

const social = [
  {
    id: 1,
    src: twitter,
    title: 'twitter',
    link: 'https://twitter.com/VaultBet',
  },
  {
    id: 2,
    src: discord,
    title: 'discord',
    link: 'https://discord.com/invite/NmV6uyYm29'
  },
];

const products = [
  {
    id: 'home',
    title: 'Home',
  },
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'sport-books',
    title: 'Sportsbook',
  },
  {
    id: 'lottery',
    title: 'Lottery',
  },
  {
    id: 'arcade',
    title: 'Arcade',
  },
  {
    id: 'terms',
    title: 'Terms',
  }
];

const contacts = [
  {
    id: 1,
    src: email,
    title: 'info@vault-bet.com',
  }
]

export default function Footer() {
  const { setTab } = useGlobal();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleTabClick = (pressedTab: TabType) => {
    scrollToTop();
    setTab(pressedTab);
  }


  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__left">
            <div className="footer__logo">
              <img className="footer__logo-img" src={logo} alt="logo vault bet" />
              <span className="footer__logo-text">VaultBet</span>
            </div>
            <p className="footer__description">
              Redefining gambling with the Internet Computer Protocol <br />
              DeFi The Odds!
            </p>

            <ul className="footer__social">
              {social.map((item) => {
                return item.title === 'discord' ? (
                  <a href={item.link} key={item.id} target='blank'>
                    <img width={25} height={25} src={item.src} alt={item.title} />
                  </a>
                ) : (
                  <a href={item.link} key={item.id} target='blank'>
                    <img width={25} height={25} src={item.src} alt={item.title} />
                  </a>
                )
                }
              )}
            </ul>
          </div>

          <nav className="footer__nav">
            <ul className="footer__list">
              <h5 className="footer__list-title">Product</h5>
              {products.map((product) => {
                return product.id === 'about' || product.id === 'terms' ? (
                  <Link to={`/${product.id}`} style={{ textDecoration: 'none' }}>
                    <li className="footer__list-item" key={product.id}>
                    <button className="footer__list-button" onClick={() => handleTabClick(product.id as TabType)}>
                      {product.title}
                    </button>
                  </li>
                  </Link>
                ) : (
                  <li className="footer__list-item" key={product.id}>
                    <button className="footer__list-button" onClick={() => handleTabClick(product.id as TabType)}>
                      {product.title}
                    </button>
                  </li>
                )
              })}
            </ul>

            <ul className="footer__list">
              <h5 className="footer__list-title">Contacts us</h5>
              {contacts.map((contact) => (
                <li className="footer__list-item" key={contact.id}>
                  <img className="footer__list-img" src={contact.src} alt={contact.title} />
                  {contact.title}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__copyright">Copyright © 2023 VaultBet S.R.L</div>
      </div>
    </footer>
  )
}

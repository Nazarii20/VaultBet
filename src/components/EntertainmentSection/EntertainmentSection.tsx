import React, { Fragment } from 'react';
import './EntertainmentSection.css';
import EntertainmentCard from '@components/EntertainmentCard/EntertainmentCard';
import sportsbook from '@assets/images/sportsbook.png';
import lottery from '@assets/images/lottery.png';
import arcade from '@assets/images/arcade.png';
import { TabType } from '@components/HomeTabs/HomeTabs';

const entertainments = [
  {
    id: 'sport-books',
    title: 'Sportsbook',
    description: `
    Dive into Vaultbet's Decentralised Betting Exchange: peer-to-peer bets, competitive odds, live updates, and big wins. Bet smart, elevate your game!
    `,
    buttonText: 'Place Bet',
    imgBgSource: sportsbook,
    link: 'games',
  },
  { 
    id: 'lottery',
    title: 'Lottery',
    description: `
    Vaultbet's ICP Lottery: Daily, Weekly, Monthly draws. Your shot at big wins every day. Play now and seize your luck! 
    `,
    buttonText: 'Play Now',
    imgBgSource: lottery,
    link: 'lottery',
  },
  { 
    id: 'arcade',
    title: 'Arcade',
    description: `
      Take a thrilling ride on Ride the Bus, experience the excitement of Crash, and enjoy the unpredictability of Plinko. It's gaming like never before. Play now and let the fun begin!
    `,
    buttonText: 'Play Now',
    imgBgSource: arcade,
    link: 'arcade',
  },
];

type EntertainmentSectionType = {
  onSetTab: (value: TabType) => void;
}

export default function EntertainmentSection({ onSetTab }: EntertainmentSectionType) {
  const handleSetTab = (tab: TabType) => onSetTab(tab);

  return (
    <section className="entertainment-section">
      {entertainments.map((entertainment) => (
        <Fragment key={entertainment.id}>
          <EntertainmentCard
            title={entertainment.title}
            description={entertainment.description}
            buttonText={entertainment.buttonText}
            imageBg={entertainment.imgBgSource}
            link={entertainment.link}
            onHandleChooseTab={() => handleSetTab(entertainment.id as TabType)}
          />
        </Fragment>
      ))}
    </section>
  )
}

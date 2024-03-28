import React from 'react';
import './MarketplaceBanner.css';
import cupVaultBet from '@assets/images/cup.png'

export default function MarketplaceBanner() {
  return (
    <section className="marketplace-banner">
      <span className="marketplace-banner__gradient" />
      <div className="marketplace-banner__left">
        <h2 className="marketplace-banner__title">
          Elevate Your Play with a VaultBet NFT, Get Yours Today!
        </h2>

        <p className="marketplace-banner__description">
          VaultBet NFT ownership offers monthly free $VBT tokens for bets, game submission rights with profit-sharing, unrestricted sports betting market data access, lifelong fee-free sports bets, quarterly town halls, VIP event access, and a VIP discord channel, along with liquidity exit options.
        </p>

        <a 
          href='https://marketplace.funded.app/collections/vaultbet' 
          className="marketplace-banner__button"
          target='blank'
        >
          Visit Marketplace
        </a>
      </div>

      <img className="marketplace-banner__img" src={cupVaultBet} alt="cup vault bet image" />
    </section>
  )
}

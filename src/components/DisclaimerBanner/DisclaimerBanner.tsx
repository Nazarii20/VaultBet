import React from 'react';
import './DisclaimerBanner.css';

export default function DisclaimerBanner() {
  return (
    <section className="disclaimer-banner">
      <h2 className="disclaimer-banner__title">
        Please <br className="disclaimer-banner__space" />
        Play <br />
        Responsibly
      </h2>

      <p className="disclaimer-banner__description">
        VaultBet encourages responsible gambling. Participation involves the use of virtual assets and cryptocurrencies and carries associated financial risks. Users must be of legal age and understand that gambling can lead to losses. Set limits, gamble responsibly, and seek professional help if needed. Read and comprehend VaultBet&apos;s terms and conditions, as they may change. Outcomes are based on chance, and winnings are not guaranteed. Only gamble with affordable funds. If concerns arise, contact relevant helpline services. By using VaultBet, users accept these risks and responsibilities.
      </p>
    </section>
  )
}

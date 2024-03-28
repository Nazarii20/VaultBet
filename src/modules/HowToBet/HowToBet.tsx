import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import plug_account from '@assets/images/plug_account.png';
import plug_account_2 from '@assets/images/plug_account_2.png';
import fullbetpage from '@assets/images/fullbetpage.png';
import acceptbetslip from '@assets/images/acceptbetslip.png';
import counterbetslip from '@assets/images/counterbetslip.png';
import useGlobal from 'src/hooks/useGlobal';

export default function HowToBet() {
	const { setPageTitle } = useGlobal();

	useEffect(() => {
		setPageTitle('How to Bet?');
	}, []);

	function renderContent() {
		return (
			<Box sx={{ py: 2 }}>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>
							<strong>How to setup up Plug wallet?</strong>
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ px: 4, pb: 6 }}>
						<Typography gutterBottom>
							What is Plug? It’s a browser extension wallet for the Internet Computer. Through it, you can interact and log into Internet Computer apps, and hold tokens or NFTs on the
							Internet Computer.
						</Typography>
						<Typography sx={{ pt: 2 }} gutterBottom variant='h6'>
							STEP 1: Download Plug
						</Typography>
						<Typography>
							First, you’re going to need to download the Plug browser extension. Plug currently has support for browsers built on Chromium (Google Chrome, Brave) and Firefox.
							<br />
							<br />
							Navigate to Plug’s website: https://plugwallet.ooo/
							<br />
							<br />
							Click on the “Download” button and select the download for your browser of choice.
							<br />
							<br />
							This will bring you to your respective browser’s store where you can add the extension to your toolbar for free (pin it so that it is always visible).
						</Typography>
						<Typography sx={{ pt: 2 }} gutterBottom variant='h6'>
							STEP 2: Create Your Wallet On Plug
						</Typography>
						<Typography>
							The first time you click on the Plug icon in the top right corner of your browser, you will be brought to a browser page where you can import an existing wallet or create a
							new one. We’re going to walk through creating a new one.
							<br />
							<br />
							<strong>A - Set Your Account’s Password</strong>
							<br />
							You will be prompted to create a password. Enter a secure password. This password is important to write down and will be needed when you sign into the Plug extension.
							<br />
							<br />
							<strong>B - Revealing & Storing Your Secret Recovery Phrase</strong>
							<br />
							After entering a valid password, you will be brought to a page that has your ‘Secret Recovery Phrase’. Your Secret Recovery Phrase will be used anytime you want to
							import/recover your wallet in Plug. Copy your Secret Recovery Phrase down somewhere safe and do not lose it or share it with anyone.
							<br />
							<br />
							<strong>
								Congratulations, you’ve got an account in Plug!
								<br />
								<br />
								After you install Plug, you need to refresh the VaultBet page, so that it can now detect that Plug is installed.
							</strong>
							<br />
							<br />
							You are almost ready to go and can start holding tokens and connecting to cool Dapps using Plug as your identity.
							<br />
							<br />
							In order to place bets, you will need to load your Plug Wallet with ICP tokens. If you do not have ICP tokens, see the next guide. Once that is done, you will be able to
							join in the fun!
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>
							<strong>How to send ICP token to Plug wallet?</strong>
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ px: 4, pb: 6 }}>
						<Typography gutterBottom>
							Now that you have a Plug wallet setup, you can connect to VaultBet.
							<br />
							<br />
							In order to place bets, you will need to use ICP tokens that you have stored in your Plug wallet.
							<br />
							<br />
							If you already have ICP in your Plug wallet, you can skip to the next section. If you do not have ICP in your Plug wallet, we will walk you through the steps to send ICP to
							your wallet.
						</Typography>
						<Typography sx={{ pt: 2 }} gutterBottom variant='h6'>
							STEP 1: Exchange FIAT to ICP tokens
						</Typography>
						<Typography gutterBottom>
							The first step to funding you Plug wallet with ICP tokens is to acquire ICP tokens. In order to do so, you will need to navigate to an exchange on which you can exchange
							fiat and crypotcurrencies for ICP.
							<br />
							<br />
							Whilst we do not endorse any one exchange, here are a few links to exchanges on which you can buy ICP tokens to help you along.
							<br />
							<Stack sx={{ pt: 1, pb: 2 }} spacing={1} direction='row'>
								<Button variant='contained' target='_blank' href='https://www.coinbase.com/'>
									Coinbase
								</Button>
								<Button variant='contained' target='_blank' href='https://www.kraken.com/'>
									Kraken
								</Button>
								<Button variant='contained' target='_blank' href='https://crypto.com/'>
									Crypto.com
								</Button>
							</Stack>
							Choose your preffered exchange and use it to acquire ICP tokens. Once you have ICP tokens on an exchange, move to STEP 2 to see how to get these stored in your Plug Wallet.
						</Typography>
						<Typography sx={{ pt: 2 }} gutterBottom variant='h6'>
							STEP 2: Sending ICP tokens to Plug wallet
						</Typography>
						<Typography gutterBottom>
							Once you have ICP tokens on an exchange, you can transfer these to your Plug walet by sending them to your Account ID.
							<br />
							<br />
							You can find your Account ID by going to your Plug wallet in your extensions bar, select Edit (1) and then click on the Edit ‘pen’ icon next your wallet (2) as shown :
							<br />
							<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
								<img src={plug_account} />
							</Box>
							<br />
							<br />
							You will then land on the Edit page, select ‘View additional wallet details’(3). You will then see your Priciple ID and Account ID.
							<br />
							<br />
							<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
								<img src={plug_account_2} />
							</Box>
							<br />
							As your transfer is coming from an exchange (and not another Plug wallet), you will use your Account ID.
							<br />
							<br />
							Copy your Account ID, navigate back to the exchange on which you currently have ICP tokens and paste your Account ID as the address to which your are sending your ICP
							tokens. Hit send.
							<br />
							<br />
							Congratulions, you now have a Plug wallet with ICP tokens stored within it and can start to place some bets!
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>
							<strong>Sportsbook</strong>
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ px: 4, pb: 6 }}>
						<Typography gutterBottom>
						    Congratulations on your set up! This guide will give a brief practical overview of how to use the VaultBet Sportsbook to trade bets like a pro.
							<br />
							<br />
							The first page you land on when using VaultBet will show all the fixtures you can currently bet on. Navigate to the league and fixture on which you would like to bet.
							<br />
							<br />
							Once you have selected your fixture you will land on the game page, where the fun begins.  
							<br />
							<br />
							<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
								<img src={fullbetpage} />
							</Box>
							<br />
							You can use the settings tab to select how odds will be displayed and switch from fractional odds (ex: 4/1) to decimal odds (5.00).
							<br />
							<br />
							1- The first thing you have to select is the market on which to buy or sell bets.
							<br />
							You can choose either team playing or a draw, as an independant market to operate in. If a fixture ends in a draw, all punters that bet on team markets will have their wagers returned to their wallet, not including VaultBet’s fee.
							<br />
							<br />
							2- Once you have selected the market you want to bet on, the next step is to decide if you are a For or Against this market and at which odds you would like to bet. 
							<br />
							<br />
							Being ‘For’ an event implies believing this event will occur and being ‘Against’ an event implies believing it will not. For example, if you are For the Draw, you believe the fixture will end in a Draw. If you are Against the Draw, you believe the fixture will not end in a Draw.
							<br />
							<br />
							3- The best offer available section will show you the best offers currently outstanding from the opposing position to yours. The best offer will show you the best market odds for you at that time and how much ICP volume you can bet at those odds. 
							<br />
							<br />
							If you are happy with the terms of the best offer available, click on those odds. This will open the betslip. 
							<br />
							<br />
							<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
								<img src={acceptbetslip} />
							</Box>
							<br />
							<br />
							Input how much ICP you would like to bet. You will see your potential profit and total cost displayed to help inform your decision.
							<br />
							<br />
							Total price includes VaultBet’s fee of 2%. If your position is not matched in the order book by the end of the fixture, this fee will be returned to your wallet and you will have only lost the transaction fee (only 0.001 ICP flat fee per transaction).
							<br />
							<br />
							Once you have input how much ICP you want to bet and you are happy with all your selections, hit Place Bet to send your bet to our order book.
							<br />
							<br />
							4- If you disagree with the odds set by the best offer available, you can design your bet further by hitting Counter Offer. This will open the bet slip. 
							<br />
							<br />
							<Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
								<img src={counterbetslip} />
							</Box>
							<br />
							<br />
							Once you are happy with your bet, hit bet to send your bet to the order book where it will wait until either a counterparty matches them or the fixture ends.
							<br />
							<br />
							To help inform your trading strategy, you can look to the historical bets of your chosen market on the graph. This will display the odds for which bets have been agreed for each market. Analyse this to gauge market sentiment and trade upcoming swings in the odds.
							<br />
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>
							<strong>Arcade: Crash</strong>
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ px: 4, pb: 6 }}>
						<Typography gutterBottom>
						   Crash is a time-based multiplayer game. Players place their wager before every round. After the round begins, a multiplier starting at 1.00x begins to steadily rise, with the multiplier representing the payout for the wagers placed at the start of the round (i.e a 1 ICP wager at 1.5x would return 1.5 ICP).
							<br />
							<br />
							Players are able to cash out anytime during a round, with the goal being to cashout before the multiplier “crashes”. Once the multiplier crashes, any players who have not cashed out lose their wager. After the multiplier crashes, there is a short waiting period before the next round begins in which players can place their wager.
							<br />
							<br />
							In order to play, you first have to deposit some ICP. Once you have ICP in your Crash balance, you can bet between Crash rounds and get to playing. 
							<br />
							<br />
							For liquidity purposes:
						</Typography>
						<Typography sx={{ pt: 2 }} gutterBottom variant='h6'>
						•	The max bet is 5 ICP, with a max profit of 100 ICP.
						<br />
						</Typography>
						<Typography gutterBottom>
						  You will be notified when your bet hits max profit, but it remains your responsibility to hit ‘Cashout’ at or after that time. 
							<br />
							<br />
							For example, if you bet 1 ICP you will be notified that you have hit max profit when the multiplier hits 100x. At this time, you can ‘Cashout’ and your balance will increase by 100 ICP. If you do not hit ‘Cashout’ by the time a crash occurs, you will lose your bet amount, regardless of if max profit was acheived or not.
							<br />
							<br />
							We are looking to relax these liquidity requirements as we grow and attract funding.
							<br />
							<br />
							Crash runs on the Internet Computer blockchain and crash numbers are generated impartially. VaultBet maintain’s a 5% house edge on each game. 
							<br />
							<br />
							That’s it, have fun!
							<br />
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>
							<strong>Arcade: Ride The Bus</strong>
						</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ px: 4, pb: 6 }}>
						<Typography gutterBottom>
						    Ride The Bus is a VaultBet original game based on a popular drinking game.
							<br />
							<br />
							Players place their wager and guess the attribute of each card in the row one by one. Correct guesses multiply the value of the bet by a set multiplier. Players are able to cashout at any time between guesses or continue guessing to multiply their winnings. If you make it all the way to the end you win and get off the bus!
							<br />
							<br />
							A wrong guess ends the game and players lose their bet and any winnings.
							<br />
							<br />
							Questions and respective multipliers in order:
							<br />
        ═════════════════════════════════════
        <br />
        | Question 1    | x2         | Decide if the card is Red or Black.                      |
        <br />
        | Question 2    | x1.5       | Decide if the card will have a value higher or lower than the previous one.  |
        <br />
        | Question 3    | x1.5       | Decide if the card falls between or outside the values of the previous two cards.        |
        <br />
        | Question 4    | x4         | Decide the suit of the card.                              |
        <br />
        ═════════════════════════════════════
        <br /><br />
							General info:
							<br />
							- Aces are low in Ride the Bus.
							<br />
							- If your card is the same value as the prior card on Question 2 or of either prior card on Question 3, the game ends and you lose.
							<br />
							- The deck contains 2 Joker cards. These are used to ensure a house edge and should they come up during your game, the game ends and you lose.
							<br />
							<br />
							For liquidity purposes, we have set a Max Bet of 5 ICP, 0.00068 ckBTC and 500 VBT.
							<br />
							<br />
							That's it, have fun!
							<br />
						</Typography>
					</AccordionDetails>
				</Accordion>
			</Box>
		);
	}

	return (
		<Box>
			<Paper sx={{ p: 2 }}>
				<Typography variant='body1'>
					With VaultBet, users are in control. You buy and sell bets on sporting events so that the market, not the bookies, decides the odds.
					<br />
					As a decentralised betting exchange, VaultBet uses smart contract technology to make sports betting peer-to-peer, trustess and fun!
					<br />
					<br />
					This guide will give a brief overview of how to use VaultBet platform to trade bets like a pro. If you want to learn more about VaultBet, have a read of our blog <a href="https://medium.com/@VaultBet/vaultbet-the-future-of-sports-betting-9848e68213e5" target="_blank" rel="noopener noreferrer"> here. </a>
					<br />
					<br />
					In order to get involved and trade bets on VaultBet, you will need a Plug wallet and ICP tokens.
					<br />
					Once you have these, you can use our 'How to Bet?' tab to learn how to place bets like a pro trader or navigate directly to a fixture to get started.
				</Typography>
			</Paper>
			{renderContent()}
		</Box>
	);
}

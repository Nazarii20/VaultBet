import './LotteryCard.css';

import bigPot from '@assets/images/pot-big.png';
import smallPot from '@assets/images/pot-small.png';
import { Principal } from '@dfinity/principal';
import lotteryCanisterIds from '@misc/lotteryCanisterIds';
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLedgerActor from 'src/hooks/useLedgerActor';
import { useAnonymousLotteryActor } from 'src/hooks/useLottery';

import LotteryCountdown from '../LotteryCountdown/LotteryCountdown';

export type LotteryInterval = 'daily' | 'weekly' | 'monthly';

interface IProps {
	lotteryInterval: LotteryInterval;
	header?: boolean;
	smallScreen?: boolean;
}

interface MinorIcon {
	left?: number;
	right?: number;
	top: number;
	size: number;
	flipped: boolean;
}

export default function LotteryCard({ lotteryInterval, header, smallScreen }: IProps) {
	const navigate = useNavigate();
	const lotteryCanisterId = lotteryCanisterIds[`${lotteryInterval}LotteryCanisterId`];

	const [hover, setHover] = useState(false);
	const anonymousLotteryActor = useAnonymousLotteryActor(lotteryCanisterId);
	const ledgerActor = useLedgerActor();
	const [isLoading, setIsLoading] = useState(false);
	const [potIcpAmount, setPotIcpAmount] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [isStarted, setIsStarted] = useState(false);
	const [currentRound, setCurrentRound] = useState(0);

	useEffect(() => {
		initialize();
	}, []);

	async function initialize() {
		try {
			setIsLoading(true);
			getCanisterBalance();

			const round = await anonymousLotteryActor.get_current_round();
			setCurrentRound(Number(round));

			const roundEndTime = await anonymousLotteryActor.get_end_time();
			setEndTime(Number(roundEndTime) / 1_000_000);

			const isStarted = await anonymousLotteryActor.is_started();
			setIsStarted(isStarted);
		} catch (error) {
			console.log('current round error', error);
		} finally {
			setIsLoading(false);
		}
	}

	async function getCanisterBalance() {
		try {
			const amount = await ledgerActor.icrc1_balance_of({
				owner: Principal.fromText(lotteryCanisterId),
				subaccount: []
			});
			setPotIcpAmount(Number(amount) / 100_000_000);
		} catch (error) {
			console.log(error);
		}
	}

	function renderSmallIcons() {
		const smallIcons: MinorIcon[] = [];
		switch (lotteryInterval) {
			// @ts-ignore
			case 'monthly':
				smallIcons.push({
					right: 30,
					top: 130,
					size: 46,
					flipped: false
				});
			// @ts-ignore
			case 'weekly':
				smallIcons.push({
					right: 30,
					top: 40,
					size: 60,
					flipped: true
				});
			case 'daily':
				smallIcons.push({
					left: 26,
					top: 120,
					size: 70,
					flipped: false
				});
		}
		return (
			<>
				{smallIcons.map(({ left, right, top, size, flipped }) => (
					<img
						style={{ left: `${left}px`, right: `${right}px`, top: `${top}px`, width: `${size}px` }}
						className={`lottery-card-icon-minor ${flipped ? 'img-flipped' : ''}`}
						src={smallPot}
						alt='pot icon'
					/>
				))}
			</>
		);
	}

	function renderLotteryCard() {
		return (
			<Box>
				{!(smallScreen && header) && <img className={`lottery-card-icon-main ${lotteryInterval == 'weekly' ? 'img-flipped' : ''}`} src={bigPot} alt='pot icon' />}
				{header
					? !smallScreen && (
							<>
								<img style={{ right: `260px`, width: `72px` }} className='lottery-card-icon-minor' src={smallPot} alt='pot icon' />
								<img style={{ right: `190px`, top: '16px', width: `42px` }} className='lottery-card-icon-minor img-flipped' src={smallPot} alt='pot icon' />
							</>
					  )
					: renderSmallIcons()}

				<div className={`lottery-card-title${smallScreen ? '-mobile' : ''}`}>
					<Typography fontSize={'2rem'}>{lotteryInterval.charAt(0).toUpperCase() + lotteryInterval.slice(1)}</Typography>
					<Typography fontSize={'2.4rem'} variant='h3' fontWeight={600}>
						{potIcpAmount.toFixed(2)} ICP
					</Typography>
				</div>

				<LotteryCountdown lotteryInterval={lotteryInterval} endTime={endTime} isStarted={isStarted} onComplete={() => initialize()}></LotteryCountdown>

				{!header && (
					<Button onClick={() => navigate(`/lottery/${lotteryInterval}`)} variant='contained' className='lottery-main-button'>
						Play Now
					</Button>
				)}
			</Box>
		);
	}

	return (
		<Box className={`${header ? 'lottery-card-header' : ''} ${smallScreen ? 'lottery-panel-mobile lottery-card-mobile' : ''} lottery-panel lottery-card`}>
			{isLoading ? <CircularProgress /> : renderLotteryCard()}
		</Box>
	);
}

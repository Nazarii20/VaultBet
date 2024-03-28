import './Lottery.css';

import LotteryCard, { LotteryInterval } from '@components/Lottery/LotteryCard/LotteryCard';
import LotteryHistoryPanel, { Winner } from '@components/Lottery/LotteryHistoryPanel/LotteryHistoryPanel';
import LotteryPurchaseModal from '@components/Lottery/LotteryPurchaseModal/LotteryPurchaseModal';
import LotteryPurchasePanel from '@components/Lottery/LotteryPurchasePanel/LotteryPurchasePanel';
import { useConnect } from '@connect2ic/react';
import { Principal } from '@dfinity/principal';
import lotteryCanisterIds from '@misc/lotteryCanisterIds';
import { theme } from '@misc/theme';
import { CheckCircle, Close } from '@mui/icons-material';
import { CircularProgress, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGlobal from 'src/hooks/useGlobal';
import useLedgerActor from 'src/hooks/useLedgerActor';
import useLotteryActor, { useAnonymousLotteryActor } from 'src/hooks/useLottery';
import { Usergeek } from 'usergeek-ic-js';

type ParticipateResult = 'none' | 'success' | 'fail';

export default function Lottery() {
	const { activeProvider, principal } = useConnect();
	const { setPageTitle } = useGlobal();
	let { interval } = useParams<{ interval: LotteryInterval }>();
	const ledgerActor = useLedgerActor();
	const [loadingCanisterBalance, setLoadingCanisterBalance] = useState(false);
	const [loadingParticipation, setLoadingParticipation] = useState(false);
	const [potIcpAmount, setPotIcpAmount] = useState(0);
	const [userIcpAmount, setUserIcpAmount] = useState(0);
	const [purchasedTickets, setPurchasedTickets] = useState<number[]>([]);
	const [previousWinners, setPreviousWinners] = useState<Winner[]>([]);
	const [ticketsToBuy, setTicketsToBuy] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [isStarted, setIsStarted] = useState(false);
	const [currentRound, setCurrentRound] = useState(0);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [partipateResult, setParticipateResult] = useState<ParticipateResult>('none');
	const [loadingTickets, setLoadingTickets] = useState(true);
	const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
	const [feeDialogOpen, setFeeDialogOpen] = useState(false);

	interval = interval || 'daily';
	const lotteryCanisterId = lotteryCanisterIds[`${interval}LotteryCanisterId`];

	const lotteryActor = useLotteryActor(activeProvider, lotteryCanisterId);
	const anonymousLotteryActor = useAnonymousLotteryActor(lotteryCanisterId);

	useEffect(() => {
		setPageTitle(' '); // TODO: fix workaround
	}, []);

	useEffect(() => {
		initialize();
	}, [principal]);

	async function initialize() {
		try {
			getCanisterBalance();
			getUserBalance();

			const round = await anonymousLotteryActor.get_current_round();
			await getTicketForRound(round);
			setCurrentRound(Number(round));

			const roundEndTime = await anonymousLotteryActor.get_end_time();
			setEndTime(Number(roundEndTime) / 1_000_000);

			const previousWinners = await anonymousLotteryActor.get_last_winners(BigInt(5));
			setPreviousWinners(previousWinners.map(winner => ({ round: Number(winner[0]), owner: winner[1], amount: Number(winner[2].e8s) })));

			const isStarted = await anonymousLotteryActor.is_started();
			setIsStarted(isStarted);
		} catch (error) {
			console.log('current round error', error);
		}
	}

	async function getTicketForRound(round: bigint) {
		try {
			setLoadingTickets(true);
			const purchaseTickets = await (await lotteryActor).get_tickets_for_round(round);
			setPurchasedTickets(purchaseTickets.map(ticket => Number(ticket)));
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingTickets(false);
		}
	}

	async function getCanisterBalance() {
		try {
			setLoadingCanisterBalance(true);
			const amount = await ledgerActor.icrc1_balance_of({
				owner: Principal.fromText(lotteryCanisterId),
				subaccount: []
			});
			setPotIcpAmount(Number(amount) / 100_000_000);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingCanisterBalance(false);
		}
	}

	async function getUserBalance() {
		try {
			if (!principal || Principal.fromText(principal) === Principal.anonymous()) {
				setUserIcpAmount(0);
				return;
			}
			const amount = await ledgerActor.icrc1_balance_of({
				owner: Principal.fromText(principal),
				subaccount: []
			});
			setUserIcpAmount(Number(amount) / 100_000_000);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingCanisterBalance(false);
		}
	}

	async function participate() {
		try {
			setLoadingParticipation(true);
			const transaction = await ledgerActor.icrc1_transfer({
				to: {
					owner: Principal.fromText(lotteryCanisterId),
					subaccount: []
				},
				amount: BigInt(ticketsToBuy * 100_000_000),
				fee: [BigInt(10_000)],
				memo: [],
				from_subaccount: [],
				created_at_time: []
			});

			const _lotteryActor = await lotteryActor;
			if ('Ok' in transaction) {
				await _lotteryActor.join_raffle(transaction.Ok);
				setParticipateResult('success');
				Usergeek.trackEvent('Daily Lottery Participate Success');
				initialize();
			} else {
				Promise.reject(transaction.Err);
			}
		} catch (error) {
			console.log(error);
			setParticipateResult('fail');
		} finally {
			setTimeout(() => {
				setParticipateResult('none');
				setLoadingParticipation(false);
			}, 5000);
		}
	}

	function renderParticipateIcon() {
		if (partipateResult === 'success') {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<CheckCircle fontSize='large' sx={{ color: 'success.main' }} />
					<Typography>Tickets bought successfully</Typography>
				</Stack>
			);
		} else if (partipateResult === 'fail') {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<Close fontSize='large' sx={{ color: 'error.main' }} />
					<Typography>Buy failed</Typography>
				</Stack>
			);
		} else {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<CircularProgress />
					<Typography>Buying ticket(s)..</Typography>
				</Stack>
			);
		}
	}

	return (
		<>
			<LotteryCard header lotteryInterval={interval} smallScreen={isSmallScreen}></LotteryCard>
			<Stack className='lottery-buy-history-container' direction={isSmallScreen ? 'column' : 'row'} alignItems='stretch' gap='32px'>
				<LotteryPurchasePanel
					ticketsToBuy={ticketsToBuy}
					setTicketsToBuy={setTicketsToBuy}
					loadingParticipation={loadingParticipation}
					loadingTickets={loadingTickets}
					purchasedTickets={purchasedTickets.length}
					activeProvider={activeProvider}
					onPurchase={() => participate()}
					smallScreen={isSmallScreen}
				/>
				<LotteryHistoryPanel previousWinners={previousWinners} principal={principal} smallScreen={isSmallScreen} />
			</Stack>

			<LotteryPurchaseModal open={confirmationModalOpen} ticketsBought={ticketsToBuy} smallScreen={isSmallScreen} handleClose={() => setConfirmationModalOpen(false)} />
		</>
	);
}

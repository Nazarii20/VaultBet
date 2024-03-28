import { useConnect } from '@connect2ic/react';
import { Game } from '@declarations/game';
import { BetSlipData } from '@modules/Games/GameDetails/GameDetails';
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { convertDecimalToFractional, convertFractionalToDecimal, getClosestStake, getNumberOfContracts, getOdds, getPremium, getStake } from '@utils/oddsHelper';
import { unwrapResult } from '@utils/resultHelper';
import { decimals, disableDecimals, sanitizeOddsDecimalInput, sanitizeStakeDecimalInput } from '@utils/validationHelper';
import React, { useEffect, useState } from 'react';
import { gameStatusToString } from 'src/helpers/gameHelper';
import useLedgerActor from 'src/hooks/useLedgerActor';
import { useOrderbookActor } from 'src/hooks/useOrderbookActor';
import { Fixture } from 'src/interfaces/fixture';
import useGlobal from 'src/hooks/useGlobal';
import { CheckCircle, Close, Info } from '@mui/icons-material';
import Dialog from '@components/Dialog/Dialog';
import localCanisterIds from '@misc/localCanisterIds';
import mainnetCanisterIds from '@misc/mainnetCanisterIds';
import { idlFactory as orderbookIdl } from '@declarations/orderbook';
import { idlFactory as ledgerIdl } from '@declarations/ledger';
import { AccountIdentifier } from '@dfinity/nns';
import { Usergeek } from "usergeek-ic-js"


interface Odds {
	fractional: number[];
	decimal: string;
}

interface IProps {
	setIsFlashing: React.Dispatch<React.SetStateAction<boolean>>;
	fixture: Fixture;
	game: Game;
	betSlipData: BetSlipData;
	onBetFinish?: () => void;
}

type BetResult = 'none' | 'success' | 'fail';

export default function BetSlip({ setIsFlashing, fixture, betSlipData, game, onBetFinish }: IProps) {
	// only used for the intialization step
	const [premium, setPremium] = useState('');
	const [contracts, setContracts] = useState('');

	const [odds, setOdds] = useState<Odds>({ fractional: [1, 1], decimal: '2' });
	const [stake, setStake] = useState('');
	const [isInitialized, setIsInitialized] = useState(false);
	const [isBetting, setIsBetting] = useState(false);
	const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
	const [oddsDialogOpen, setOddsDialogOpen] = useState(false);
	const [TotalPriceDialogOpen, setTotalPriceDialogOpen] = useState(false);
	const [betResult, setBetResult] = useState<BetResult>('none');

	const calculatedNumberOfContracts = getNumberOfContracts(getPremium(Number(odds.decimal)), Number(stake)) || 1;
	let calculatedAmountToPay = getClosestStake(Number(odds.decimal), Number(stake)) * 1.02;

	const { notationType, host } = useGlobal();
	const { activeProvider } = useConnect();
	let ledgerActor = useLedgerActor();

	useEffect(() => {
		initialize();
	}, [betSlipData]);

	function initialize() {
		setIsFlashing(true);
		setTimeout(() => setIsFlashing(false), 200);
		const _premium = betSlipData.data.bestPremium;
		setPremium(String(_premium));

		const _contracts = betSlipData.data.bestVolume;
		setContracts(String(_contracts));
		const _odds = _premium === 0 ? 2 : getOdds(Number(_premium));
		const fractionalOdds = convertDecimalToFractional(_odds).split('/').map(Number);
		setOdds({
			decimal: _odds.toFixed(2),
			fractional: [isNaN(fractionalOdds[0]) || !fractionalOdds[0] ? 1 : fractionalOdds[0], isNaN(fractionalOdds[1]) || !fractionalOdds[1] ? 1 : fractionalOdds[1]]
		});

		const _stake = getClosestStake(_odds, getStake(_premium, Number(_contracts))).toFixed(2);
		setStake(_stake);

		setIsInitialized(true);
	}

	async function handlePlaceBet() {
		try {
			setIsBetting(true);
			const isAllowedStatus = ['Scheduled', 'Ongoing', 'Postponed'].includes(gameStatusToString(game.game_status));

			if (!isAllowedStatus) {
				console.log('Game status is not allowed');
				alert('You Cannot Currently Bet On this game');
				return;
			}

			// get teamA or draw orderbook
			const isConnected = await activeProvider?.isConnected();
			if (!isConnected) {
				alert('Please Connect your wallet before placing a bet');
			}

			let orderbookActor;
			let orderBookString = betSlipData.orderbook === 'draw' ? game.draw_order_book[0]!.toString() : game.teama_order_book.toString();
			const isProd = process.env.NODE_ENV === 'production';
			let ledgerCanisterId = mainnetCanisterIds.ledgerCanisterId;
			let gameControllerId = mainnetCanisterIds.gameCanisterId;
			if (!isProd) {
				ledgerCanisterId = localCanisterIds.ledgerCanisterId;
				gameControllerId = localCanisterIds.gameCanisterId;
			}

			if (activeProvider?.meta.id === 'infinity') {
				const whitelist = [orderBookString, ledgerCanisterId, gameControllerId];
				await (window as any).ic?.infinityWallet?.requestConnect({
					whitelist: whitelist
				});
				try {
					orderbookActor = await (window as any).ic.infinityWallet?.createActor({
						canisterId: orderBookString,
						interfaceFactory: orderbookIdl,
						host: host
					});
				} catch (error) {
					console.log('InfinityWallet Error', error);
				}

				ledgerActor = await (window as any).ic.infinityWallet?.createActor({
					canisterId: ledgerCanisterId,
					interfaceFactory: ledgerIdl,
					host: host
				});
			} else {
				orderbookActor = await useOrderbookActor(activeProvider, orderBookString);
			}
			const depositAddressResult = await orderbookActor?.getDepositAddress();
			const depositAddress = await unwrapResult(depositAddressResult);

			let transferAmount = BigInt((calculatedAmountToPay * decimals).toFixed(0));
			let calculatedPremium = BigInt(0);
			if (betSlipData.counterOffer) {
				calculatedPremium = BigInt(Math.floor(Number(Number(getPremium(Number(odds.decimal)) * decimals).toFixed(0)) / 10_000) * 10_000);
			} else {
				calculatedPremium = BigInt(Math.round((betSlipData.data.bestPremium * decimals) / 10000) * 10000);
				transferAmount = BigInt(Number(calculatedPremium) * calculatedNumberOfContracts * 1.02);
			}
			const ledgerResult = await ledgerActor.transfer({
				to: depositAddress as AccountIdentifier,
				amount: { e8s: transferAmount },
				created_at_time: [],
				fee: { e8s: BigInt(10000) },
				from_subaccount: [],
				memo: BigInt(1)
			});

			// check block index on the canister to see if the transaction actually went through
			const ledgerTransactionBlockIndex = await unwrapResult(ledgerResult);
			if (betSlipData.orderbook === 'teamb') {
				if (betSlipData.market === 'for') {
					console.log('for teamb');
					const orderbookOrder = await orderbookActor?.placeOrderSell({ e8s: calculatedPremium }, { e8s: Number(calculatedNumberOfContracts) });
					await unwrapResult(orderbookOrder);
				} else {
					console.log('against teamb');
					const orderbookOrder = await orderbookActor?.placeOrderBuy({ e8s: calculatedPremium }, { e8s: Number(calculatedNumberOfContracts) });
					await unwrapResult(orderbookOrder);
				}
			} else {
				if (betSlipData.market === 'for') {
					console.log('for teama or draw');
					const orderbookOrder = await orderbookActor?.placeOrderBuy({ e8s: calculatedPremium }, { e8s: Number(calculatedNumberOfContracts) });
					await unwrapResult(orderbookOrder);
				} else {
					console.log('against teama or draw');
					const orderbookOrder = await orderbookActor?.placeOrderSell({ e8s: calculatedPremium }, { e8s: Number(calculatedNumberOfContracts) });
					await unwrapResult(orderbookOrder);
				}
			}
			Usergeek.trackEvent("Sports Bet Placed Success");
			setBetResult('success');
		} catch (error) {
			setBetResult('fail');
			console.log(error);
		} finally {
			setTimeout(() => {
				onBetFinish && onBetFinish();
				setIsBetting(false);
				setBetResult('none');
				window.location.reload();
			}, 5000);
		}
	}
	function changeFractionalOdds(value: number, index: number) {
		let _value = value;
		if (value < 1) {
			_value = 1;
		}
		let _odds = [...odds.fractional];

		_odds[index] = _value;
		let decimal_odds = convertFractionalToDecimal(_odds);
		if (decimal_odds > 50) {
			decimal_odds = 50;
			_odds = [50, 1];
		} else if (decimal_odds < 1.02) {
			decimal_odds = 1.02;
			_odds = [1, 50];
		}

		setOdds({
			fractional: _odds,
			decimal: decimal_odds.toString()
		});
	}

	function changeDecimalOdds(value: string) {
		setOdds({
			fractional: convertDecimalToFractional(Number(value)).split('/').map(Number),
			decimal: value
		});
	}

	function renderOddsDisplay() {
		if (notationType == 'fractional') {
			if (!isNaN(odds.fractional[0]) || odds.fractional[0] || !isNaN(odds.fractional[1]) || odds.fractional[1]) {
				return <strong>{odds.fractional[0] + '/' + odds.fractional[1]}</strong>;
			} else {
				return <strong>-</strong>;
			}
		} else {
			return Number(odds.decimal).toFixed(2);
		}
	}

	function renderOddsInputs() {
		if (notationType == 'fractional') {
			return (
				<Box sx={{ display: 'flex', flexGrow: 1 }}>
					<TextField
						onFocus={e => e.target.select()}
						disabled={isBetting}
						size='small'
						onChange={e => disableDecimals(e.target.value, v => changeFractionalOdds(Number(v), 0))}
						value={odds.fractional[0]}
						fullWidth
					/>
					<Typography variant='body1' sx={{ py: 1, px: 2 }}>
						/
					</Typography>
					<TextField
						onFocus={e => e.target.select()}
						disabled={isBetting}
						size='small'
						onChange={e => disableDecimals(e.target.value, v => changeFractionalOdds(Number(v), 1))}
						value={odds.fractional[1]}
						fullWidth
					/>
				</Box>
			);
		} else {
			return (
				<TextField
					error={Number(odds) < 1.02}
					size='small'
					value={odds.decimal}
					onChange={e => sanitizeOddsDecimalInput(e.target.value, changeDecimalOdds)}
					InputProps={{ endAdornment: <span style={{ fontSize: '0.75rem' }}>{odds && convertDecimalToFractional(Number(odds.decimal))}</span> }}
				/>
			);
		}
	}

	function getVoteDirection() {
		if (betSlipData.orderbook === 'draw') {
			if (betSlipData.market === 'for') {
				return 'For Draw';
			} else {
				return 'Against Draw';
			}
		} else {
			if (betSlipData.market === 'for') {
				return `For ${betSlipData.team}`;
			} else {
				return `Against ${betSlipData.team}`;
			}
		}
	}

	function renderBetIcon() {
		if (betResult === 'success') {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<CheckCircle fontSize='large' sx={{ color: 'success.main' }} />
					<Typography>Bet placed successfully</Typography>
				</Stack>
			);
		} else if (betResult === 'fail') {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<Close fontSize='large' sx={{ color: 'error.main' }} />
					<Typography>Bet failed</Typography>
				</Stack>
			);
		} else {
			return (
				<Stack spacing={2} justifyContent='center' alignItems='center'>
					<CircularProgress />
					<Typography>Placing bet..</Typography>
				</Stack>
			);
		}
	}

	if (!isInitialized) {
		return <>initializing</>;
	}

	if (isBetting) {
		return <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>{renderBetIcon()}</Box>;
	}

	return (
		<Box>
			<List disablePadding>
				<ListItem disablePadding>
					<ListItemText sx={{ width: '50%' }}>Position</ListItemText>
					<ListItemText sx={{ width: '50%' }}>
						<strong>{getVoteDirection()}</strong>
					</ListItemText>
				</ListItem>
				<ListItem disablePadding>
					<ListItemText sx={{ width: '50%' }}>
						<Stack direction={'row'} alignItems='center' spacing={0.5}>
							<Typography>Odds</Typography>
							<IconButton size='small' onClick={() => setOddsDialogOpen(true)}>
								<Info />
							</IconButton>
						</Stack>
					</ListItemText>
					<ListItemText sx={{ width: '50%' }}>{betSlipData.counterOffer ? renderOddsInputs() : renderOddsDisplay()}</ListItemText>
				</ListItem>
				<ListItem disablePadding>
					<ListItemText sx={{ width: '50%' }}>
						<Stack direction={'row'} alignItems='center' spacing={0.5}>
							<Typography>Stake</Typography>
							<IconButton size='small' onClick={() => setStakeDialogOpen(true)}>
								<Info />
							</IconButton>
						</Stack>
					</ListItemText>
					<ListItemText sx={{ width: '50%', display: 'flex' }}>
						<TextField
							disabled={isBetting}
							size='small'
							fullWidth
							value={isNaN(Number(stake)) ? '' : stake}
							onChange={e => sanitizeStakeDecimalInput(e.target.value, setStake)}
							InputProps={{ endAdornment: <span style={{ fontSize: '0.75rem' }}>{odds.decimal && getClosestStake(Number(odds.decimal), Number(stake)).toFixed(2)}</span> }}
						/>
					</ListItemText>
				</ListItem>
			</List>
			{/* <Stack spacing={1} direction={'row'} my={2}>
				<ListItemText sx={{ width: '50%' }}>Contracts</ListItemText>
				<ListItemText sx={{ width: '50%' }}>{calculatedNumberOfContracts}</ListItemText>
			</Stack> */}
			<List sx={{ py: 2 }}>
				<ListItem disablePadding>
					<ListItemText sx={{ width: '50%' }}>Potential Payout</ListItemText>
					<ListItemText sx={{ width: '50%' }}>
						<strong>{odds.decimal ? (Number(odds.decimal) * getClosestStake(Number(odds.decimal), Number(stake))).toFixed(2) : 0} ICP</strong>
					</ListItemText>
				</ListItem>
				<ListItem disablePadding>
					<ListItemText sx={{ width: '50%' }}>
						<Stack direction={'row'} alignItems='center' spacing={0.5}>
							<Typography>Total Price</Typography>
							<IconButton size='small' onClick={() => setTotalPriceDialogOpen(true)}>
								<Info />
							</IconButton>
						</Stack>
					</ListItemText>
					<ListItemText sx={{ width: '50%' }}>
						<strong>{!isNaN(calculatedAmountToPay) ? calculatedAmountToPay.toFixed(2) : 0.0}</strong> ICP
					</ListItemText>
				</ListItem>
			</List>
			<Button disabled={Number(odds.decimal) < 1.02 || isBetting} fullWidth size='medium' variant='contained' color='success' onClick={handlePlaceBet}>
				{isBetting ? <CircularProgress size={24} /> : 'Place bet'}
			</Button>
			<Dialog
				open={oddsDialogOpen}
				onClose={() => setOddsDialogOpen(false)}
				title='Odds explained'
				content={
					<>
						Odds are the probability of your chosen position occuring and determine the size of your potential payout. For trading purposes, the maxium and minimum odds we can allow are
						50/1 and 1/50 respectively.
						<br />
						<br />
						Fractional odds (eg:4/1)
						<br />
						Fractional odds represent the potential profit that you can make on a bet relative to the amount you stake. The first number in the fraction represents the potential profit you
						can make, while the second number represents the stake. For example, if the odds are 4/1, it means that for every 1 ICP you stake, if you win, you will receive 4 ICP in profit and the return of your 1 ICP staked.
						<br />
						<br />
						Decimal odds (eg:5.00)
						<br />
						Decimal odds represent the amount that will be returned for every unit that you bet. For example, if the decimal odds are 5.00, it means that for every 1 ICP that you bet, you
						will receive 5 ICP in total payout if your bet wins. This includes the 1 ICP staked plus the 4 ICP profit.
						<br />
						Fractional odds of 4/1 and Decimal odds of 5.00 are the same odds.
						<br />
					</>
				}
			/>
			<Dialog
				open={stakeDialogOpen}
				onClose={() => setStakeDialogOpen(false)}
				title='Stake explained'
				content={
					<>
						Stake is the amount of ICP you bet. For trading purposes, this can only be set in increments. Input the amount of ICP you would ideally like to bet and we will propose the
						closest allowed increment.
					</>
				}
			/>
			<Dialog
				open={TotalPriceDialogOpen}
				onClose={() => setTotalPriceDialogOpen(false)}
				title='Total price explained'
				content={
					<>
						{' '}
						The total price of creating this bet includes VaultBet's service fee of 2%, which covers the cost of the blockchain transactions required to host this platform. If your bet
						goes unmatched, we will return this fee to you on markets close.{' '}
					</>
				}
			/>
		</Box>
	);
}

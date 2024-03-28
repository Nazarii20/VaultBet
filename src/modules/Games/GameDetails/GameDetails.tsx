import BetSlip from '@components/BetSlip/BetSlip';
import Dialog from '@components/Dialog/Dialog';
import GameBet from '@components/GameBet/GameBet';
import GameCard from '@components/GameCard/GameCard';
import GameDetailsGraph from '@components/GameDetailsGraph/GameDetailsGraph';
import PopularGames from '@components/PopularGames/PopularGames';
import { Game } from '@declarations/game';
import { Quote } from '@declarations/orderbook';
import { teamCodes } from '@misc/teamCodes';
import { theme } from '@misc/theme';
import { Box, Card, CardContent, CardHeader, ListItemText, Paper, Stack, useMediaQuery } from '@mui/material';
import { unwrapResult } from '@utils/resultHelper';
import { decimals, getPrettyDecimals } from '@utils/validationHelper';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGameActor from 'src/hooks/useGameActor';
import useGlobal from 'src/hooks/useGlobal';
import { Actor } from '@dfinity/agent';
import { useAnonymousOrderbookActor } from 'src/hooks/useOrderbookActor';
import { Fixture } from 'src/interfaces/fixture';

export interface BetData {
	bestPremium: number;
	bestVolume: number;
}
export interface TeamBetData {
	teamAFor: BetData;
	teamAAgainst: BetData;
	drawFor: BetData | undefined;
	drawAgainst: BetData | undefined;
	teamBFor: BetData;
	teamBAgainst: BetData;
}
export interface OrderbooksData {
	teama: Quote[];
	draw: Quote[] | undefined;
	betData: TeamBetData | undefined;
	teamAOrderBook: Actor | undefined;
	drawOrderBook: Actor | undefined;
}

export type Market = 'for' | 'against';
export type Orderbook = 'teama' | 'draw' | 'teamb';

export interface BetSlipData {
	team: string | undefined;
	data: BetData;
	counterOffer: boolean;
	market: Market;
	orderbook: Orderbook;
}

export default function GameDetails() {
	const params = useParams<{ id: string }>();
	const gameActor = useGameActor();
	const [game, setGame] = useState<Game | undefined>(undefined);
	const [fixture, setFixture] = useState<Fixture | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [betslipDialogOpen, setBetslipDialogOpen] = useState(false);
	const [totalTraded, setTotalTraded] = useState(0);
	const [orderbooks, setOrderbooks] = useState<OrderbooksData>({ teama: [], draw: [], betData: undefined, teamAOrderBook: undefined, drawOrderBook: undefined });
	const [betSlipData, setBetSlipData] = useState<BetSlipData>({ team: '', data: { bestPremium: 0, bestVolume: 0 }, counterOffer: true, market: 'for', orderbook: 'teama' });
	const [isFlashing, setIsFlashing] = useState(false);

	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	const { fixtures, setPageTitle } = useGlobal();

	useEffect(() => {
		setPageTitle(' ');
	}, []);

	useEffect(() => {
		initialize();
	}, [params.id]);

	async function initialize() {
		if (params.id) {
			let fixture = fixtures.find(f => f.fixture.id === Number(params.id));
			if (fixture) {
				const result = await gameActor.getGame(BigInt(fixture.league.id), BigInt(fixture.fixture.id));
				const game = await unwrapResult(result);
				await getGameOrderBook(game);
				setFixture(fixture);
				setBetSlipData({ team: `${teamCodes[fixture.teams.home.name]}`, data: { bestPremium: 0, bestVolume: 0 }, counterOffer: true, market: 'for', orderbook: 'teama' });
				setGame(game);
			}
		}
	}

	async function getGameOrderBook(game: Game) {
		try {
			setIsLoading(true);
			const teamaActor = useAnonymousOrderbookActor(game.teama_order_book.toString());

			const bestSellPremiumTeamA = await teamaActor.getBestSellPremium();
			const bestBuyPremiumTeamA = await teamaActor.getBestBuyPremium();

			const bestSellVolumeTeamA = await teamaActor.getBestSellVolume();
			const bestBuyVolumeTeamA = await teamaActor.getBestBuyVolume();

			const teamBetData: TeamBetData = {
				teamAFor: {
					bestPremium: Number(bestSellVolumeTeamA.e8s) !== 0 ? (decimals - Number(bestSellPremiumTeamA.e8s)) / decimals : 0,
					bestVolume: Number(bestSellVolumeTeamA.e8s)
				},
				teamAAgainst: {
					bestPremium: Number(bestBuyVolumeTeamA.e8s) !== 0 ? (decimals - Number(bestBuyPremiumTeamA.e8s)) / decimals : 0,
					bestVolume: Number(bestBuyVolumeTeamA.e8s)
				},
				drawFor: undefined,
				drawAgainst: undefined,
				teamBFor: {
					bestPremium: Number(bestBuyVolumeTeamA.e8s) !== 0 ? (decimals - Number(bestBuyPremiumTeamA.e8s)) / decimals : 0,
					bestVolume: Number(bestBuyVolumeTeamA.e8s)
				},
				teamBAgainst: {
					bestPremium: Number(bestSellVolumeTeamA.e8s) !== 0 ? (decimals - Number(bestSellPremiumTeamA.e8s)) / decimals : 0,
					bestVolume: Number(bestSellVolumeTeamA.e8s)
				}
			};

			let drawActor: Actor | undefined = undefined;
			let drawOrders: Quote[] | undefined = undefined;
			let totalDraw = 0;
			if (game.draw_order_book[0] !== undefined) {
				const drawActor = useAnonymousOrderbookActor(game.draw_order_book[0]!.toString());
				const bestSellPremiumDraw = await drawActor.getBestSellPremium();
				const bestBuyPremiumDraw = await drawActor.getBestBuyPremium();

				const bestSellVolumeDraw = await drawActor.getBestSellVolume();
				const bestBuyVolumeDraw = await drawActor.getBestBuyVolume();

				teamBetData.drawFor = {
					bestPremium: Number(bestSellVolumeDraw.e8s) !== 0 ? (decimals - Number(bestSellPremiumDraw.e8s)) / decimals : 0,
					bestVolume: Number(bestSellVolumeDraw.e8s)
				};
				teamBetData.drawAgainst = {
					bestPremium: Number(bestBuyVolumeDraw.e8s) !== 0 ? (decimals - Number(bestBuyPremiumDraw.e8s)) / decimals : 0,
					bestVolume: Number(bestBuyVolumeDraw.e8s)
				};
				drawOrders = await drawActor.getHistoricalQuotes();
				totalDraw = drawOrders.reduce((total, order) => total + Number(order.contracts.e8s), 0);
			}

			let teamaOrders = await teamaActor.getHistoricalQuotes();
			let totalTeamA = teamaOrders.reduce((total, order) => total + Number(order.contracts.e8s), 0);
			let totalTraded = totalTeamA + totalDraw;

			setOrderbooks(() => {
				return {
					teama: teamaOrders,
					draw: drawOrders,
					betData: teamBetData,
					teamAOrderBook: teamaActor,
					drawOrderBook: drawActor
				};
			});
			setTotalTraded(() => {
				return totalTraded;
			});
			if (totalTraded === 0) {
				setBetSlipData(prevState => ({ ...prevState, counterOffer: true }));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	if (!game || !fixture || isLoading) {
		return <div>Loading...</div>;
	}

	if (isSmallScreen) {
		return (
			<Stack>
				<Box sx={{ display: 'flex', flexGrow: 1 }}>
					<Box sx={{ flexGrow: 1, pb: 1, px: 1 }}>
						<strong>Full Time Result</strong>
					</Box>
					<Box sx={{ pb: 1, px: 1 }}>
						Traded: <strong>{totalTraded} ICP</strong>
					</Box>
				</Box>
				<Box sx={{ pb: 1 }}>
					<GameCard fixture={fixture} small />
				</Box>
				<Paper sx={{ p: 2, flexGrow: 1, background: 'rgba(46, 50, 58, 0.70)' }}>
					<GameDetailsGraph orderbooks={orderbooks} fixture={fixture} />
				</Paper>
				<Paper sx={{ flexGrow: 1, padding: 2, mt: 1, overflow: 'auto', background: 'rgba(46, 50, 58, 0.70)' }}>
					<GameBet
						small
						orderbooks={orderbooks}
						setBetSlipData={data => {
							setBetSlipData(data);
							setBetslipDialogOpen(true);
						}}
						fixture={fixture}
					/>
				</Paper>
				<Dialog
					open={betslipDialogOpen}
					onClose={() => setBetslipDialogOpen(false)}
					title='Betslip'
					content={<BetSlip setIsFlashing={setIsFlashing} betSlipData={betSlipData} fixture={fixture} game={game} onBetFinish={() => setBetslipDialogOpen(false)} />}
				/>
			</Stack>
		);
	}

	return (
		<Box>
			<Stack direction={'row'} spacing={2}>
				<Box width={'65%'}>
					<Box sx={{ display: 'flex', flexGrow: 1 }}>
						<Box sx={{ flexGrow: 1, pb: 1, px: 1, }}>
							Bet is: <strong>Full Time Result</strong>
						</Box>
						<Box sx={{ pb: 1, px: 1 }}>
							Total traded: <strong>{totalTraded} ICP</strong>
						</Box>
					</Box>
					<Box sx={{ pb: 1 }}>
						<GameCard fixture={fixture} small />
					</Box>
					<Paper sx={{ p: 2, background: 'rgba(46, 50, 58, 0.70)' }}>
						<GameDetailsGraph orderbooks={orderbooks} fixture={fixture} />
					</Paper>
					<Box sx={{ pt: 1 }}>
						<Stack spacing={2} direction={'row'}>
							<Paper sx={{ flexGrow: 1, padding: 2, background: 'rgba(46, 50, 58, 0.70)' }}>
								<GameBet orderbooks={orderbooks} setBetSlipData={setBetSlipData} fixture={fixture} />
							</Paper>
						</Stack>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
					<Box sx={{ pb: 1 }}>&nbsp;</Box>
					<Card sx={isFlashing ? { background: '#b65ff7', width: 400 } : { width: 400, background: 'rgba(46, 50, 58, 0.70)' }}>
						<CardHeader
							title='Bet Slip'
							action={
								<ListItemText
									sx={{ textAlign: 'right', pr: 1.5 }}
									primary={`${teamCodes[fixture.teams.home.name] || fixture.teams.home.name} vs ${teamCodes[fixture.teams.away.name] || fixture.teams.away.name}`}
									secondary={'Full time result'}
								/>
							}
						/>
						<CardContent>
							<BetSlip setIsFlashing={setIsFlashing} betSlipData={betSlipData} fixture={fixture} game={game} />
						</CardContent>
					</Card>
					<PopularGames fixtures={fixtures} />
				</Box>
			</Stack>
		</Box>
	);
}

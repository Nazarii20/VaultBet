import { useConnect } from '@connect2ic/react';
import { Tabs, Tab, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { unwrapResult } from '@utils/resultHelper';
import React, { useEffect, useState } from 'react';
import { client } from 'src/App';
import useGameActor from 'src/hooks/useGameActor';
import { Game } from '@declarations/game';
import useGlobal from 'src/hooks/useGlobal';
import { idlFactory as orderbookIdl } from '@declarations/orderbook';
import { useOrderbookActor } from 'src/hooks/useOrderbookActor';
import { Fixture } from 'src/interfaces/fixture';
import { PortfolioItem } from 'src/interfaces/portfolio';
import { convertDecimalToFractional, getOdds, getStake } from '@utils/oddsHelper';
import { decimals } from '@utils/validationHelper';
import BetList from '@components/BetLists/BetList';
import BetListClosed from '@components/BetLists/BetListClosed';

export interface IProps {
	items: PortfolioItem[];
}

enum TabIndex {
	Active = 0,
	Pending = 1,
	Closed = 2,
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}


function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function getPredictionPriceResult(
	orderType: string,
	fixture: Fixture | undefined,
	side: string,
	contracts: string,
	locked: number,
) {
	const drawBool = fixture?.teams.home.winner === null ? true : false
	const teamABool = fixture?.teams.home.winner
	let result = 'DRAW'
	let prediction: string | undefined = 'Not Draw'
	const price = (Number(contracts) * Number(locked) * 1.02).toFixed(2) // price paid plus the fee
	if (orderType === "draw") {
		if (drawBool) {
			if (side === "Buy") {
				result = "WON"
				prediction = 'Draw'
			}
			else {
				result = "LOST"
			}
		}
		else {
			if (side === "Buy") {
				result = "LOST"
				prediction = 'Draw'
			}
			else {
				result = "WON"
			}
		}
	} else {
		if (side === "Buy") {
			prediction = fixture?.teams.home.name
			if (teamABool) {
				result = "WON"
			}
			else if (!drawBool) {
				result = "LOST"
			}
		} else {
			prediction = fixture?.teams.away.name
			if (teamABool) {
				result = "LOST"
			}
			else if (!drawBool) {
				result = "WON"
			}
		}
	}
	return [prediction, price, result]
}



export default function Portfolio() {
	const [isLoading, setIsLoading] = useState(true);

	const [closedOrders, setClosedOrders] = useState<PortfolioItem[]>([]);
	const [activeOrders, setActiveOrders] = useState<PortfolioItem[]>([]);
	const [pendingOrders, setPendingOrders] = useState<PortfolioItem[]>([]);

	const gameActor = useGameActor();

	const { activeProvider } = useConnect();
	const { fixtures, setPageTitle, notationType, host } = useGlobal();

	useEffect(() => {
		setPageTitle('Portfolio');
	}, []);

	useEffect(() => {
		if (activeProvider) {
			initialize();
		}
	}, [activeProvider]);

	const [value, setTabIndex] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
	};

	function findFixture(match_id: bigint, league_id: bigint) {
		for (const fixture of fixtures) {
			// Skip to the next item in the loop
			if (fixture.league.id === Number(league_id) && fixture.fixture.id == Number(match_id)) {
				return fixture
			}
		}
	}

	async function getGameDetails(games: Array<Game>, canisterIds: Array<Array<string>>) {

		const activeOrders: Array<PortfolioItem> = []
		const pendingOrders: Array<PortfolioItem> = []
		const closedOrders: Array<PortfolioItem> = []

		for (let i = 0; i < games.length; i++) {
			const game = games[i]
			const orderBookIds = canisterIds[i]
			const gameStatus = JSON.stringify(game.game_status)
			const fixture = findFixture(game.match_id, game.league_id)
			const orderTypes: Array<string> = ["draw", "teama"]
			for (let k = 0; k < orderBookIds.length; k++) {
				const orderType: string = orderTypes[k]

				// Use Orderbook
				let actor;
				if (activeProvider?.meta.id === "infinity") {

					const whitelist = [orderBookIds[k]];
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					await (window as any).ic?.infinityWallet?.requestConnect({
						whitelist: whitelist,
					});

					try {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						actor = await (window as any).ic.infinityWallet?.createActor({
							canisterId: orderBookIds[k],
							interfaceFactory: orderbookIdl,
							host: host
						});
						console.log("INF orderbookActor", orderBookIds[k])
					} catch (error) {
						console.log("Infinity Wallet Error", error)
					}

				} else {
					actor = await useOrderbookActor(activeProvider, orderBookIds[k]);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let orders: any = [];
				try {
					const ordersResponse = await actor.getOrders()
					orders = await unwrapResult(ordersResponse)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					if (Object.keys(error)[0] === "UserNotFound") {
						console.log("UserNotFound")
						continue;
					}
				}


				if (orders !== undefined) {
					for (let j = 0; j < orders.length; j++) {
						const order = orders[j]
						const orderState = Object.keys(order.state)[0]
						const match = fixture?.teams.home.name + ' V ' + fixture?.teams.away.name;

						const finished = gameStatus.substring(2, 10) === "Finished" ? true : false

						const pushTo = [];
						let contracts = Number(order.original_amount.e8s) - Number(order.current_amount.e8s)
						if (finished) {
							if (contracts > 0 || orderState === "Close") {
								// CLOSED
								contracts = orderState === "Close" ? Number(order.original_amount.e8s) : contracts
								pushTo.push([0, contracts])
							}
						}
						else {
							if ((Number(order.original_amount.e8s) - Number(order.current_amount.e8s)) > 0) {
								// ACTIVE
								pushTo.push([1, contracts])
							}
							if (Number(order.current_amount.e8s) > 0 && orderState !== "Cancel" && orderState !== "Close") {
								// PENDING
								contracts = Number(order.current_amount.e8s)
								pushTo.push([2, contracts])
							}
						}
						for (const orderToPush of pushTo) {
							const orderContracts = orderToPush[1]
							const side = Object.keys(order.side)[0]
							const locked = Number(order.premium.e8s) / decimals
							const premium = locked
							const decimalOdds = getOdds(premium)
							const stake = getStake(premium, Number(orderContracts))

							const odds = notationType === 'fractional' ? convertDecimalToFractional(decimalOdds) : decimalOdds.toFixed(2)
							const [prediction, price, result] = getPredictionPriceResult(orderType, fixture, side, String(orderContracts), locked);
							let payout = stake * decimalOdds;
							if (finished) {
								payout = result == "LOST" ? 0 : contracts
							}


							const item: PortfolioItem = {
								orderId: order.id,
								match: match,
								prediction: prediction,
								stake: String(stake.toFixed(2)),
								odds: String(odds),
								totalPrice: price,
								potentialPayout: String(payout.toFixed(2)),
								result: result,
								orderbookActor: actor

							}
							if (orderToPush[0] === 0) {
								closedOrders.push(item);
							} else if (orderToPush[0] === 1) {
								activeOrders.push(item);
							} else if (orderToPush[0] === 2) {
								pendingOrders.push(item);
							}

						}
					}
				}
			}
		}
		setIsLoading(false);
		return [activeOrders, pendingOrders, closedOrders]

	}

	async function initialize() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let games: any[] = []
		let leagues = []
		for (const fixture of fixtures) {
			leagues.push(fixture.league.id)
		}
		leagues = [...new Set(leagues)];

		for (const league of leagues) {
			try {
				const gamesResponse = await gameActor.getGamesFromLeague(BigInt(league))
				const gamesResult = await unwrapResult(gamesResponse)
				games = [...games, ...gamesResult]
				games.concat(gamesResult)
			} catch (error) {
				console.log(error)
			}

		}
		const canisterIds = [...new Set(games.map(f => (!f.draw_order_book[0] ? [f.teama_order_book.toString()] : [f.draw_order_book[0].toString(), f.teama_order_book.toString()])))];
		console.log(client.activeProvider?.meta);
		if (client.activeProvider && client.activeProvider.meta.id !== 'nfid' && client.activeProvider.meta.id !== 'stoic') {
			client.activeProvider.config = { whitelist: canisterIds.flat() };
			await client.activeProvider.connect();
		}
		const [activeOrders, pendingOrders, closedOrders] = await getGameDetails(games, canisterIds)
		setActiveOrders(activeOrders)
		setPendingOrders(pendingOrders)
		setClosedOrders(closedOrders)

	}

	return (
		<Paper>
			{isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
				<CircularProgress size={50} />
			</div> :
				<Box>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs value={value} onChange={handleChange} centered textColor="inherit" indicatorColor="secondary"
							variant="fullWidth">
							<Tab label="Active" {...a11yProps(TabIndex.Active)} />
							<Tab label="Pending" {...a11yProps(TabIndex.Pending)} />
							<Tab label="Closed" {...a11yProps(TabIndex.Closed)} />
						</Tabs>
					</Box>
					<TabPanel value={value} index={TabIndex.Active}>
						<BetList items={activeOrders} isPending={false}></BetList>
					</TabPanel>
					<TabPanel value={value} index={TabIndex.Pending}>
						<BetList items={pendingOrders} isPending={true}></BetList>
					</TabPanel>
					<TabPanel value={value} index={TabIndex.Closed}>
						<BetListClosed items={closedOrders}></BetListClosed>
					</TabPanel>
				</Box>
			}
		</Paper>
	);
}

import ArcadeNavbar from '@modules/Arcade/arcadeComponents/ArcadeNavbar';
import { Grid, useMediaQuery } from '@mui/material';
import ballAudio from '@sounds/ball.wav';
import { useBankActor } from 'src/hooks/useBankActor';
import { usePlinkoActor } from 'src/hooks/usePlinkoActor';
import { useConnect } from '@connect2ic/react';
import mainnetCanisterIds from '@misc/mainnetCanisterIds';
import { Bodies, Body, Composite, Engine, Events, IEventCollision, Render, Runner, World } from 'matter-js';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useGameStore } from '../../store/game';
import { random } from '../../utils/random';

import { LinesType, MultiplierValues } from './@types';
import { BetActions } from './components/BetActions';
import { PlinkoGameBody } from './components/GameBody';
import { MultiplierHistory } from './components/MultiplierHistory';
import { config } from './config';
import { getMultiplierByLinesQnt, getMultiplierSound } from './config/multipliers';
import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useArcadeContext } from '@context/ArcadeContext';
import { decimals } from '@utils/validationHelper';
import './index.css';
import { Token } from '@declarations/bank';

let gameInfo: any;

export function Game() {
	let idxs: any;
	let idMulValue: any;

	const categoryWall_110 = 1;
	const categoryWall_41 = 2;
	const categoryWall_10 = 4;
	const categoryWall_5 = 8;
	const categoryWall_3 = 16;
	const categoryWall_15 = 32;
	const categoryWall_1 = 64;
	const categoryWall_05 = 128;
	const categoryWall_03 = 256;

	const categoryBall_110 = 1 * 1024;
	const categoryBall_41 = 2 * 1024;
	const categoryBall_10 = 4 * 1024;
	const categoryBall_5 = 8 * 1024;
	const categoryBall_3 = 16 * 1024;
	const categoryBall_15 = 32 * 1024;
	const categoryBall_1 = 64 * 1024;
	const categoryBall_05 = 128 * 1024;
	const categoryBall_03 = 256 * 1024;

	const category_pin = 512;
	const category_Multiplier = 512 * 1024;
	const category_walls = 1024 * 1024;

	const categories = [
		[categoryWall_110, categoryBall_110],
		[categoryWall_41, categoryBall_41],
		[categoryWall_10, categoryBall_10],
		[categoryWall_5, categoryBall_5],
		[categoryWall_3, categoryBall_3],
		[categoryWall_15, categoryBall_15],
		[categoryWall_1, categoryBall_1],
		[categoryWall_05, categoryBall_05],
		[categoryWall_03, categoryBall_03]
	];

	const mColors: string[] = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#880000', '#008800'];

	const multiplierIndexToValueMap = [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110];

	// #region States
	const incrementCurrentBalance = useAuthStore(state => state.incrementBalance);
	const engine = Engine.create();
	const [lines, setLines] = useState<LinesType>(16);
	const [walletType, setWalletType] = useState('plug');
	const inGameBallsCount = useGameStore(state => state.gamesRunning);
	const incrementInGameBallsCount = useGameStore(state => state.incrementGamesRunning);
	const decrementInGameBallsCount = useGameStore(state => state.decrementGamesRunning);
	const getGameInfo = useGameStore(state => state.getGameInfo);
	const setGameInfo = useGameStore(state => state.setGameInfo);
	const getGameActor = useGameStore(state => state.getActor);
	const setGameActor = useGameStore(state => state.setActor);
	const [lastMultipliers, setLastMultipliers] = useState<number[]>([]);
	const [loader, setLoader] = useState(false);
	const [gameLoader, setGameLoader] = useState(false);
	const { currency, userData, setUserData } = useArcadeContext();
	const { activeProvider, principal } = useConnect();
	const bankActor = useBankActor();
	const { pins: pinsConfig, colors, ball: ballConfig, engine: engineConfig, world: worldConfig, scale, pinScale } = config;
	const isSmallScreen = useMediaQuery('(max-height:900px)');

	const handleWalletChange = (event: any) => {
		setWalletType(event.target.value);
	};

	const worldWidth: number = worldConfig.width;

	const worldHeight: number = worldConfig.height;

	useEffect(() => {
		engine.gravity.y = engineConfig.engineGravity;
		const element = document.getElementById('plinko');
		const render = Render.create({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			element: element!,
			bounds: {
				max: {
					y: worldHeight,
					x: worldWidth
				},
				min: {
					y: 0,
					x: 0
				}
			},
			options: {
				background: 'transparent',
				hasBounds: true,
				width: worldWidth,
				height: worldHeight,
				wireframes: false
			},
			engine
		});
		const runner = Runner.create();
		Runner.run(runner, engine);
		Render.run(render);
		return () => {
			World.clear(engine.world, true);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, [lines]);

	useEffect(() => {
		try {
			const fetchPlinkoActor = async () => {
				const plinkoActor = await usePlinkoActor(activeProvider, mainnetCanisterIds.plinkoCanisterId);
				console.log('Calling setGameActor for pid:', activeProvider?.principal);
				setGameActor(plinkoActor);
			};
			if (typeof activeProvider != 'undefined') {
				fetchPlinkoActor();
			}
		} catch (e) {
			console.log('fetchPlinkoActor error', e);
		}
	}, [activeProvider]);

	const pins: Body[] = [];

	for (let l = 0; l < lines; l++) {
		const linePins = pinsConfig.startPins + l;
		const lineWidth = linePins * pinsConfig.pinGap;
		for (let i = 0; i < linePins; i++) {
			const pinX = worldWidth / 2 - lineWidth / 2 + i * pinsConfig.pinGap + pinsConfig.pinGap / 2;

			const pinY = worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

			const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
				label: `pin-${l}-${i}`,
				restitution: 1,
				collisionFilter: {
					category: category_pin,
					mask: -1
				},
				render: {
					fillStyle: '#F5DCFF'
				},
				isStatic: true
			});
			pins.push(pin);
		}
	}

	function addInGameBall() {
		if (inGameBallsCount > 15) return;
		incrementInGameBallsCount();
	}

	function removeInGameBall() {
		return decrementInGameBallsCount();
	}

	async function getArcadeBalance(currency: string) {
		const token = { [currency]: BigInt(0) };
		const balance = await bankActor.getBalance(token as Token);
		const newUserData = {
			...userData,
			balance: Number(balance) / decimals,
			principalId: principal
		};

		setUserData(newUserData);
	}

	const addOne2OneBall = useCallback(
		(ballValue: number, idxs: any, idMulValue: any, index: number) => {
			addInGameBall();
			const ballSound = new Audio(ballAudio);
			ballSound.volume = 0.2;
			ballSound.currentTime = 0;
			ballSound.play();
			const minBallX = worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap;
			const maxBallX = worldWidth / 2 - pinsConfig.pinSize * 3 - pinsConfig.pinGap + pinsConfig.pinGap / 2;
			let ballX = parseFloat(random(minBallX, maxBallX));
			let cate = categories[idxs[index]];
			const ballColor = ballValue <= 0 ? colors.text : colors.purple;
			const ball = Bodies.circle(ballX, 25, ballConfig.ballSize, {
				restitution: 1,
				friction: 0.6,
				label: `ball-${ballValue}-${index}-${idMulValue[index]}-${ballX}`,
				id: new Date().getTime(),
				frictionAir: 0.05,
				collisionFilter: {
					category: cate[1],
					mask: cate[0] | cate[1] | category_pin | category_walls | category_Multiplier
				},
				render: {
					fillStyle: ballColor
				},
				isStatic: false
			});
			Composite.add(engine.world, ball);
		},
		[lines]
	);

	const df = 0.1;
	const angles = [(Math.PI * 1.9) / 3.0, (Math.PI * 1.1) / 3.0];

	const multipliers = getMultiplierByLinesQnt(lines);

	const multipliersBodies: Body[] = [];
	const walls: Body[] = [];

	let lastMultiplierX: number = worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap;

	multipliers.forEach((multiplier, index) => {
		const blockSize = 20; // height and width
		const multiplierBody = Bodies.rectangle(lastMultiplierX + 20 * scale, worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap, blockSize * scale, blockSize * scale, {
			label: multiplier.label,
			isStatic: true,
			collisionFilter: {
				category: category_Multiplier,
				mask: index < 9 ? categories[index][1] : categories[16 - index][1]
			},
			render: {
				sprite: {
					xScale: 1 * scale,
					yScale: 1 * scale,
					texture: multiplier.img
				}
			}
		});
		lastMultiplierX = multiplierBody.position.x;
		multipliersBodies.push(multiplierBody);
	});

	for (let idx = 0; idx < 9; idx++) {
		let arr = [idx + 1, 15 - idx * 2, 15 - idx * 2, idx + 1];

		arr.map((arri, index) => {
			for (let i = 0; i < arri; i++) {
				let wall = Bodies.rectangle(
					index < 2
						? worldWidth / 2 - (pinsConfig.pinGap * ((index % 3 ? -i - df : i + df + 2) + 15 - idx * 2)) / 2 + (i < 1 ? (index % 2 === 0 ? -1 : 1) * (pinsConfig.pinSize / 2) : 0)
						: worldWidth / 2 + (pinsConfig.pinGap * ((index % 3 ? -i - df : i + df + 2) + 15 - idx * 2)) / 2 + (i < 1 ? (index % 2 === 0 ? -1 : 1) * (pinsConfig.pinSize / 2) : 0),
					worldWidth - pinsConfig.pinGap * (2 + df / 5.0 + i + 0.3) - (i < 1 ? pinsConfig.pinSize / 3 : 0),
					5 * scale * pinScale,
					9 * scale,
					{
						label: 'wall-' + idx,
						collisionFilter: {
							category: categories[idx][0],
							mask: categories[idx][0] | categories[idx][1]
						},
						angle: angles[index % 2],
						render: {
							fillStyle: mColors[idx],
							visible: false
						},
						isStatic: true
					}
				);
				walls.push(wall);
			}
		});
	}

	const leftWall = Bodies.rectangle(worldWidth / 2.0 - pinsConfig.pinSize * 5 - pinsConfig.pinGap * 5.5, worldWidth / 2.0, worldWidth * 2, 40 * scale, {
		angle: 90,
		render: {
			visible: false
		},
		collisionFilter: {
			category: category_Multiplier
		},
		isStatic: true
	});
	const rightWall = Bodies.rectangle(worldWidth / 2.0 + pinsConfig.pinSize * 5 + pinsConfig.pinGap * 5.5, worldWidth / 2.0, worldWidth * 2, 40, {
		angle: -90,
		render: {
			visible: false
		},
		isStatic: true
	});
	const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
		label: 'block-1',
		render: {
			visible: false
		},
		isStatic: true
	});

	Composite.add(engine.world, [...pins, ...multipliersBodies, ...walls, leftWall, rightWall, floor]);

	async function one2onebet(betValue: number, nBalls: number) {
		try {
			setLoader(true);
			setLastMultipliers([]);
			const plinkoActor = getGameActor();
			if (typeof plinkoActor == 'undefined') {
				setLoader(false);
				throw 'Actor is undefined';
				return;
			}
			const e8sBetAmount = BigInt(Math.floor(betValue * decimals));
			console.log('e8sBetAmount', e8sBetAmount);
			gameInfo = await plinkoActor.createBet(currency, e8sBetAmount, BigInt(nBalls));
			setGameInfo(gameInfo);
			await getArcadeBalance(currency);
			idxs = [];
			idMulValue = [];
			gameInfo.length > 0 &&
				gameInfo.map((game: any) => {
					idxs.push(parseInt(game.multiplierIndex));
					idMulValue.push(multiplierIndexToValueMap[parseInt(game.multiplierIndex)]);
				});

			setLoader(false);
			setGameLoader(true);

			let counter = 0;
			const timer = setInterval(() => {
				addOne2OneBall(betValue, idxs, idMulValue, counter);
				counter++;
				if (counter === idxs.length) {
					clearInterval(timer);
				}
			}, 2000);
		} catch (e) {
			setLoader(false);
			setGameLoader(false);
			Store.addNotification({
				message: 'Error. Please try again.',
				type: 'danger',
				insert: 'top',
				container: 'top-center',
				animationIn: ['animate__animated', 'animate__fadeIn'],
				animationOut: ['animate__animated', 'animate__fadeOut'],
				dismiss: {
					duration: 5000,
					onScreen: true
				}
			});
			console.log('createBet error', e);
			return;
		}
	}

	async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
		ball.collisionFilter.group = 2;
		World.remove(engine.world, ball);
		const remBalls: any = removeInGameBall();
		const ballValue = ball.label.split('-')[1];
		const MultiplierBall = ball.label.split('-')[3];
		const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues;

		const multiplierSong = new Audio(getMultiplierSound(multiplierValue));
		multiplierSong.currentTime = 0;
		multiplierSong.volume = 0.2;
		multiplierSong.play();
		setLastMultipliers(prev => [multiplierValue, prev[0], prev[1], prev[2]]);

		if (+ballValue <= 0) return;

		const newBalance = +ballValue * multiplierValue;
		// await incrementCurrentBalance(newBalance);
		if (remBalls <= 0) {
			try {
				let submitObj: any[] = [];
				const currGameInfo = getGameInfo();
				currGameInfo.length > 0 &&
					currGameInfo.map((game: any) => {
						submitObj.push({
							gameId: game.gameId,
							multiplierValue: multiplierIndexToValueMap[parseInt(game.multiplierIndex)].toString()
						});
					});
				setGameLoader(false);
				setLoader(true);

				const plinkoActor = getGameActor();
				let gameResponses: any;
				if (typeof plinkoActor != 'undefined') gameResponses = await plinkoActor.submitBet(submitObj);
				let errorGames: any = [];
				gameResponses.map((gameResp: any) => {
					if (parseInt(gameResp.status) == 3) {
						errorGames.push(gameResp.gameId);
					}
				});
				await getArcadeBalance(currency);
				setLoader(false);
				if (errorGames.length > 0) {
					Store.addNotification({
						message: 'Error. Please try again.',
						type: 'danger',
						insert: 'top',
						container: 'top-center',
						animationIn: ['animate__animated', 'animate__fadeIn'],
						animationOut: ['animate__animated', 'animate__fadeOut'],
						dismiss: {
							duration: 5000,
							onScreen: true
						}
					});
				}
			} catch (e) {
				setLoader(false);
				Store.addNotification({
					message: 'Error. Please try again.',
					type: 'danger',
					insert: 'top',
					container: 'top-center',
					animationIn: ['animate__animated', 'animate__fadeIn'],
					animationOut: ['animate__animated', 'animate__fadeOut'],
					dismiss: {
						duration: 5000,
						onScreen: true
					}
				});
				console.log('submitBet error', e);
			}
			setLoader(false);
		}
	}

	async function onBodyCollision(event: IEventCollision<Engine>) {
		const pairs = event.pairs;
		for (const pair of pairs) {
			const { bodyA, bodyB } = pair;
			if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
				await onCollideWithMultiplier(bodyB, bodyA);
			}
		}
	}

	Events.on(engine, 'collisionActive', onBodyCollision);

	return (
		<div style={{ overflowX: 'auto' }}>
			<ReactNotifications />
			<div style={{ margin: '0 0 0 0' }}>
				<ArcadeNavbar />
			</div>
			<div className='plinko-game-container'>
				<Grid
					container
					item
					xs={11}
					sm={7}
					md={8}
					direction={{ md: 'row', sm: 'column' }}
					order={{ md: 2, sm: 1 }}
					justifyContent='center'
					alignItems='center'
					style={{
						background: '#1A1B1E',
						border: '2px solid #32353C',
						borderRadius: '24px',
						height: 'calc(100vh - 250px)'
					}}
					maxWidth={{ md: '100%' }}>
					<Grid container item xs={12} sm={8} md={10} justifyContent='center' alignItems='center'>
						<PlinkoGameBody />
					</Grid>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							transform: 'translateY(-50%)',
							right: '50px',
							display: isSmallScreen ? 'none' : 'flex',
						}}>
						<MultiplierHistory multiplierHistory={lastMultipliers} />
					</div>
				</Grid>

				<Grid container item xs={11} sm={7} md={4} order={{ md: 1, sm: 2 }} justifyContent='center' display='block' maxWidth='496px' className='betactions-container'>
					<BetActions loader={loader} setLoader={setLoader} gameLoader={gameLoader} inGameBallsCount={inGameBallsCount} onChangeLines={setLines} onRunOne2OneBet={one2onebet} />
				</Grid>
			</div>
		</div>
	);
}

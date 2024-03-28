import React, { useEffect, useState, useRef } from "react";
import { ArcadeGame } from "src/interfaces/arcadeGame";
import ArcadeNavbar from "@modules/Arcade/arcadeComponents/ArcadeNavbar";
import BettingForm from "./components/BettingForm";
import "./css/App.css";
import Axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiveBetsTracker from "./components/LiveBetsTracker";
import { Grid } from "@mui/material";
import { useAnonymousCrashActor } from "src/hooks/useCrashActor";
import mainnetCanisterIds from "@misc/mainnetCanisterIds";
import { decimals } from "@utils/validationHelper";
import CrashChart from "./components/CrashChart";
import { useArcadeContext } from "@context/ArcadeContext";
import { Bet } from "@declarations/crash";

// eslint-disable-next-line @typescript-eslint/no-var-requires
let CanvasJS = require("../../../../assets/js/canvasjs.min.js");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
CanvasJS = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

type CrashProps = {
	game: ArcadeGame;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Crash({ game }: CrashProps) {
	const [liveMultiplier, setLiveMultiplier] = useState("CONNECTING...");
	const [liveMultiplierSwitch, setLiveMultiplierSwitch] = useState(false);
	const [betActive, setBetActive] = useState(false);
	const [bBettingPhase, setbBettingPhase] = useState(false);
	const [bettingPhaseTime, setBettingPhaseTime] = useState<number | string>(-1);
	const [liveBettingTable, setLiveBettingTable] = useState<Bet[] | null>(null);
	const [globalTimeNow, setGlobalTimeNow] = useState(0);
	const [chartSwitch, setChartSwitch] = useState(false);
	const [betAmount, setBetAmount] = useState<number>(5);
	const [chartData, setChartData] = useState<{
		labels: number[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		datasets: any[];
	}>({
		labels: [],
		datasets: [],
	});
	const [crashHistory, setCrashHistory] = useState<number[]>([]);
	const [crashEngineState, setCrashEngineState] = useState("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [cashoutMessage, setCashoutMessage] = useState<string>("");
	const { currency, currencyDetails, setCheckBalance } = useArcadeContext();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenHeight(window.innerHeight));

    return () => {
      window.removeEventListener('resize', () => setScreenHeight(window.innerHeight));
    };
  }, []);

	const crashCanisterId = mainnetCanisterIds.crashCanisterId;

	const crashActor = useAnonymousCrashActor(crashCanisterId);

	function getValuesOfHighestIndexes(arr: [number, number][]): number[] {
		// Sort the array in descending order based on the index (first value)
		arr.sort((a, b) => b[0] - a[0]);
		// Get the values of the 12 highest indexes
		const values: number[] = arr.slice(0, 20).map(item => item[1]);

		return values;
	}
	const fechCrashHistory = async () => {
		const history = await crashActor.fechCrashHistory();
		// console.log('history', history);

		const transformedArr = getValuesOfHighestIndexes(history);
		setCrashHistory(transformedArr);
	};

	// useEffect(() => {
	// 	try {
	// 		signArcadeActor();
	// 		getArcadeBalance(currency);
	// 	} catch (error) {
	// 		console.log("Error: ", error);
	// 	}
	// }, [bBettingPhase, liveBettingTable]);


	useEffect(() => {
		fechCrashHistory();
	}, [bBettingPhase]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (!bBettingPhase) {
			intervalId = setInterval(async () => {
				try {
					const liveBets = await crashActor.fechBets();
					// console.log("liveBets", liveBets)
					setLiveBettingTable(liveBets);
					setCheckBalance((check) => check + 1);
				} catch (error) {
					console.error("Error occurred during fetching bets:", error);
				}
			}, 2000);
		}
		return () => {
			clearInterval(intervalId);
		};
	}, [bBettingPhase]);


	const multiplierCount = useRef<number[]>([]);
	const timeCount_xaxis = useRef<number[]>([]);
	const realCounter_yaxis = useRef(5);
	useEffect(() => {
		const isCrash = process.env.TEST_ENV === 'crash';

		let socket: WebSocket;
		if (process.env.NODE_ENV === "production" || isCrash) {
			socket = new WebSocket("wss://vaultcrash.com/ws:844");
		} else {
			socket = new WebSocket("ws://localhost:844");
		}

		socket.onopen = () => {
			console.log("WebSocket connection established.");
		};

		socket.onmessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			// console.log("Socket Data: ", data)
			const { name, value } = data;

			let count = 0;
			const timer = setInterval(async () => {
				const liveBets = await crashActor.fechBets();
				// console.log("liveBets Socket", liveBets)
				setLiveBettingTable(liveBets);
				setCheckBalance((check) => check + 1);

				count++;
				if (count >= 20) {
					clearInterval(timer); // Stop the timer after 20 seconds
				}
			}, 10000);

			switch (name) {
				case "start_multiplier_count":
					setGlobalTimeNow(Date.now());
					setLiveMultiplierSwitch(true);
					setCrashEngineState("loading");
					break;
				case "call_current_multiplier":
					setGlobalTimeNow(Date.now());
					setLiveMultiplierSwitch(true);
					setLiveMultiplier(value);
					setCrashEngineState("active");
					break;
				case "stop_multiplier_count":
					setLiveMultiplier(value);
					setLiveMultiplierSwitch(false);
					setCrashEngineState("over");
					setBetActive(false);
					break;
				case "start_betting_phase":
					setErrorMessage("");
					setGlobalTimeNow(Date.now());
					setLiveMultiplier("Starting...");
					setCrashEngineState("loading");
					setbBettingPhase(true);
					setLiveBettingTable(null);
					setCheckBalance((check) => check + 1);


					multiplierCount.current = [];
					timeCount_xaxis.current = [];
					break;
				default:
					break;
			}
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed.");
		};

		return () => {
			socket.close();
		};
	}, []);

	useEffect(() => {
		if (Number(liveMultiplier) > currencyDetails.maxProfit / betAmount && betActive) {
			setErrorMessage(`${currencyDetails.maxProfit} ${currencyDetails.displayCurrency} max profit reached! Cashout!`);
		}
	}, [betAmount, betActive, liveMultiplier]);

	useEffect(() => {
		let gameCounter: NodeJS.Timer | null = null;
		if (liveMultiplierSwitch) {
			gameCounter = setInterval(() => {
				const time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
				setLiveMultiplier((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2))

				if (multiplierCount.current.length < 1) {
					multiplierCount.current = [...multiplierCount.current, 1];
					timeCount_xaxis.current = [...timeCount_xaxis.current, 0];
				}

				if (realCounter_yaxis.current % 5 == 0) {
					multiplierCount.current = [
						...multiplierCount.current,
						Number((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2)),
					];
					timeCount_xaxis.current = [...timeCount_xaxis.current, time_elapsed];
				}
				realCounter_yaxis.current += 1;
			}, 1);
		}
		return () => {
			if (gameCounter !== null) {
				clearInterval(Number(gameCounter));
			}
		};
	}, [liveMultiplierSwitch]);

	useEffect(() => {
		let bettingInterval: NodeJS.Timer | null = null;

		if (bBettingPhase) {
			setCashoutMessage("")
			bettingInterval = setInterval(() => {
				// const time_elapsed = (Date.now() - globalTimeNow);
				const time_elapsed = (Date.now() - globalTimeNow) / 1000.0;
				// const time_remaining = (20 - time_elapsed).toFixed(2);
				const time_remaining = (20 - time_elapsed).toFixed(1);
				setBettingPhaseTime(Number(time_remaining));
				if (Number(time_remaining) < 0) {
					setbBettingPhase(false);
					setCheckBalance((check) => check + 1);
				}
			}, 10);
		}
		return () => {
			if (bettingInterval !== null) {
				clearInterval(Number(bettingInterval));
			}
			setBettingPhaseTime("Starting...");
		};
	}, [bBettingPhase]);

	useEffect(() => {
		get_game_status();
		setChartSwitch(true);
	}, []);

	// Routes
	let API_BASE: string;
	if (process.env.NODE_ENV === "production" || process.env.TEST_ENV === "crash") {
		API_BASE = "https://vaultcrash.com";
	} else {
		API_BASE = "http://localhost:843";
	}


	const get_game_status = () => {
		Axios.get(API_BASE + "/get_game_status", {
			withCredentials: true,
		}).then((res) => {
			console.log("Phase = ", res.data.phase)
			if (res.data.phase === "betting_phase") {
				setGlobalTimeNow(res.data.info);
				setbBettingPhase(true);
				setCheckBalance((check) => check + 1);
			} else if (res.data.phase === "game_phase") {
				setGlobalTimeNow(res.data.info);
			}
		});
	};

	const manual_cashout_early = (token: string | undefined) => {
		setCashoutMessage("Cashing out early...");
		console.log("Token: ", token);
		Axios.get(API_BASE + "/manual_cashout_early", {
			params: {
				token: token,
			},
		}).then((res) => {
			console.log('res.data: ', res.data)
			const adjustedAmount = Number(res.data) / decimals
			console.log("adjustedAmount: ", adjustedAmount)
			setBetActive(false);
			setCashoutMessage("Cashed out at " + (adjustedAmount / Number(betAmount)).toFixed(2) + "x")
			if (currency === "VBT") {
				setErrorMessage("VBT Winnings returned in ICP, check ICP balance");
			}
		})
			.catch((error) => {
				console.log(error);
				setErrorMessage("Failed to cashout early");
			})
	};

	useEffect(() => {
		const temp_interval = setInterval(() => {
			setChartSwitch(false);
			sendToChart();
		}, 1);

		return () => {
			clearInterval(temp_interval);
			setChartSwitch(true);
		};
	}, [chartSwitch]);

	// Chart Data
	const sendToChart = () => {
		setChartData({
			labels: timeCount_xaxis.current,

			datasets: [
				{
					data: multiplierCount.current,
					backgroundColor: "rgba(75,192,192,0.2)",
					borderColor: "rgba(75,192,192,1)",
					color: "rgba(255, 255, 255,1)",

					pointRadius: 0,
					borderDash: [35, 5],
					lineTension: 0.1,
				},
			],
		});
	};

	//JSX
	return (
		<div className="App">
			<div className="top-bar">
				<ToastContainer />
			</div>
			<div className="crash-arcade-navbar-container">
				<ArcadeNavbar />
			</div>

			<div style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '25px',
			}}>

				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Grid className="grap_plot_mbl" item xs={8} md={8}>
						<div className="graph">
							<div className="graph-container">
								{chartData ? (
									screenHeight < 900 ? (
										<CrashChart
											width={360}
											height={260}
											globalTimeNow={globalTimeNow}
											crashEngineState={crashEngineState}
											crashHistory={crashHistory}
											liveMultiplier={liveMultiplier}
											liveMultiplierSwitch={liveMultiplierSwitch}
										/>
									) : (
										<CrashChart
											width={360}
											height={360}
											globalTimeNow={globalTimeNow}
											crashEngineState={crashEngineState}
											crashHistory={crashHistory}
											liveMultiplier={liveMultiplier}
											liveMultiplierSwitch={liveMultiplierSwitch}
										/>
									)
								) : (
									""
								)}
							</div>
							<div className="game_value">
								{(() => {
									if (bBettingPhase) {
										return (
											<div>
												<div className="betting_phase_time">
													<div className="betting_phase_time_title">Prepare For Launch </div>
													<div className="betting_phase_time_desc">
														{String(bettingPhaseTime)}
													</div>
												</div>
											</div>
										);
									} else {
										return (
											<h1
												className={`${!liveMultiplierSwitch &&
													liveMultiplier !== "Starting..." &&
													liveMultiplier !== "CONNECTING..."
													? "multipler_crash_value_message"
													: "multipler_value_message"
													}`}
											>
												{!liveMultiplierSwitch &&
													liveMultiplier !== "Starting..." &&
													liveMultiplier !== "CONNECTING..." ? (
													<div>
														<div className="betting_phase_time_title" style={{ color: '#FF403C' }}>Crashed</div>
														<div className="betting_phase_time_desc" style={{ color: '#FF403C' }}>{+liveMultiplier + "x"}</div>
													</div>
												) : liveMultiplier !== "Starting..." ? (
													<span style={{ fontSize: liveMultiplier === "CONNECTING..." ? "24px" : ""}}>
														{liveMultiplier}x
													</span>
												) : (
													"Starting..."
												)}
											</h1>
										);
									}
								})()}
							</div>
						</div>
					</Grid>
					<Grid item xs={12} md={4}>
						<div>
							<div className="side">
								<BettingForm
									betActive={betActive}
									setBetActive={setBetActive}
									bBettingPhase={bBettingPhase}
									liveMultiplier={liveMultiplier}
									manualCashoutEarly={manual_cashout_early}
									setBetAmount={setBetAmount}
									betAmount={betAmount}
									errorMessage={errorMessage}
									setErrorMessage={setErrorMessage}
									cashoutMessage={cashoutMessage}
								/>
								<div className="bet-tracker">
									<div className="tracker-container">
										<LiveBetsTracker liveBettingTable={liveBettingTable} />
									</div>
								</div>
							</div>
							{/* bet slip */}
						</div>
					</Grid>
				</div>


				<Grid className="grap_plot" item xs={12} md={8}>
					<div className="graph">
						<div className="graph-container">
							{chartData && (
								<CrashChart
									width={1200}
									height={520}
									globalTimeNow={globalTimeNow}
									crashEngineState={crashEngineState}
									crashHistory={crashHistory}
									liveMultiplier={liveMultiplier}
									liveMultiplierSwitch={liveMultiplierSwitch}
								/>
							)}
						</div>
						<div className="game_value">
							{bBettingPhase ? (
								<div className="betting_phase_time">
									<div className="betting_phase_time_title">Prepare For Launch </div>
									<div className="betting_phase_time_desc">{String(bettingPhaseTime)}</div>
								</div>
							) : (
								<h1
									className={
										!liveMultiplierSwitch &&
											liveMultiplier !== "Starting..." &&
											liveMultiplier !== "CONNECTING..."
											? "multipler_crash_value_message"
											: "multipler_value_message"
									}
								>
									{!liveMultiplierSwitch &&
										liveMultiplier !== "Starting..." &&
										liveMultiplier !== "CONNECTING..." ? (
										<div>
											<div className="betting_phase_time_title" style={{ color: '#FF403C' }}>Crashed</div>
											<div className="betting_phase_time_desc" style={{ color: '#FF403C' }}>{+liveMultiplier + "x"}</div>
										</div>
									) : liveMultiplier !== "Starting..." ? (
										liveMultiplier + "x"
									) : (
										"Starting..."
									)}
								</h1>
							)}
						</div>
					</div>
				</Grid>
			</div>
			{/* </Grid> */}
		</div>
	);
}

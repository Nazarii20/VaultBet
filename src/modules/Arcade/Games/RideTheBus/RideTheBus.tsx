/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ArcadeGame } from "src/interfaces/arcadeGame";
import ArcadeNavbar from "@modules/Arcade/arcadeComponents/ArcadeNavbar";
import mainnetCanisterIds from "@misc/mainnetCanisterIds";
import localCanisterIds from "@misc/localCanisterIds";
import BettingForm from "./components/BettingForm/BettingForm";
import PlayingCards from "./components/PlayingCards/PlayingCards";
import Question from "./components/Question/Question";
import { UserState } from "@declarations/busRide";
import { Token } from '@declarations/busRide';
import { useBankActor } from "src/hooks/useBankActor";

import { useConnect } from "@connect2ic/react";
import { decimals } from "@utils/validationHelper";
import { useArcadeContext } from "@context/ArcadeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAnonymousBusRideActor, useBusRideActor } from "src/hooks/useBusRideActor";
import GameStatus from "../RideTheBus/components/GameStatus/GameStatus";
import ScreenBlur from "../RideTheBus/components/ScreenBlur/ScreenBlur";
import CustomButton from "./components/CustomButton/CustomButton";
import { systemPositiveDefault, systemPositiveHover, textBlack } from "./utils/variables";
import './RideTheBus.css';
import CashOutPopup from "./components/CashOutPopup/CashOutPopup";
import Loader from "./components/Loader/Loader";
// import CashOutPopup from "./components/CashOutPopup/CashOutPopup";


type BusRideProps = {
	game: ArcadeGame;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BusRide({ game }: BusRideProps) {
	// const [userData, setUserData] = useState<UserData>({
	// 	balance: 0,
	// 	principalId: "",
	// });
	const { activeProvider, principal } = useConnect();
	// const { currency } = useArcadeContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// const [signedArcadeActor, setSignedArcadeActor] = useState<any>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [signedBusRideActor, setSignedBusRideActor] = useState<any>();

	const [stage, setStage] = useState<string>("loading");
	const [userState, setUserState] = useState<UserState | undefined>();
	const [winnings, setWinnings] = useState<Token>({
		CKBTC: 0n
	});
	const [betAmount, setBetAmount] = useState<string>('0');
	const [amount, setAmount] = useState('-');
	const [winningsAmount, setWinningsAmount] = useState<string>('0');
	const [loadingStage, setLoadingStage] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	let busRideCanisterId = localCanisterIds.busRideCanisterId;
	const isProd = process.env.NODE_ENV === 'production';
	const isCrash = process.env.TEST_ENV === 'crash';

	const { currency, userData, setUserData } = useArcadeContext();

	if (isProd || isCrash) {
		busRideCanisterId = mainnetCanisterIds.busRideCanisterId;
	}

	const busRideActor = useAnonymousBusRideActor(busRideCanisterId);

	const signBusRideActor = async () => {
		try {
			const signedBusRideActor = await useBusRideActor(activeProvider, busRideCanisterId);
			setSignedBusRideActor(signedBusRideActor);
		} catch (error) {
			console.error("Error Sigining Bus Actor", error);
		}
	};

	useEffect(() => {
		if (activeProvider) {
			signBusRideActor();
		}
	}, [activeProvider]);

	const firstRender = useRef(true);

	useEffect(() => {
		const fetchStage = async () => {
			try {
				const stage = await signedBusRideActor.get_stage();
				if (stage) {
					if (firstRender.current === true) {
						setStage("landing");
						setBetAmount('0')
						setAmount('')
						setWinningsAmount('');
						firstRender.current = false;
					} else {
						setStage("stage");
					}
				}
			} catch (error) {
				console.error("Error fetching stage:", error);
			}
			finally {
				setStage('landing')
			}
		};
		if (busRideActor) {
			fetchStage();
		}
	}, [activeProvider, signedBusRideActor]);

	useEffect(() => {
		const fetchUserState = async () => {
			try {
				const state = await signedBusRideActor.get_user_state();
				// if (firstRender.current === true) {
				// 	setStage("landing");
				// 	firstRender.current = false;
				// } else {
				// 	setStage(state.stage);
				// }
				setUserState(state);
				// console.log('fetchUserStateEEEEEE', state.stage)
			} catch (error) {
				console.error("Error fetching state:", error);
			}
		};
		if (busRideActor) {
			fetchUserState();
		}
	}, [activeProvider, signedBusRideActor]);

	const bankActor = useBankActor();

	// GET BALANCE
	const getArcadeBalance = async (currency: string) => {

		const token = { [currency]: BigInt(0) };
		const balance = await bankActor.getBalance(token as Token);
		const newUserData = {
			...userData,
			balance: Number(balance) / decimals,
			principalId: principal,
		}

		setUserData(newUserData);
	}

	useEffect(() => {
		try {
			getArcadeBalance(currency);
		} catch (error) {
			console.log("Error: ", error);
		}
	}, [currency, activeProvider]);

	const handleQuestion = (option: string) => {
		console.log(option)
		let questionResponse: any;
		const stage = String(userState?.stage);

		switch (stage) {
			case "suits":
				setLoadingStage(true);
				signedBusRideActor.make_guess_suit(option)
					.then((response: any) => {
						questionResponse = response;
						handleQuestionResponse();
					})
					.catch((erorr: any) => console.log(erorr))
					.finally(() => setLoadingStage(false));
				break;
			case "higher_or_lower":
				setLoadingStage(true);
				signedBusRideActor.make_guess_higher_or_lower(option)
					.then((response: any) => {
						questionResponse = response;
						handleQuestionResponse();
					})
					.catch((erorr: any) => console.log(erorr))
					.finally(() => setLoadingStage(false));
				break;
			case "between_or_outside":
				setLoadingStage(true);
				signedBusRideActor.make_guess_between_or_outside(option)
					.then((response: any) => {
						questionResponse = response;
						handleQuestionResponse();
					})
					.catch((erorr: any) => console.log(erorr))
					.finally(() => setLoadingStage(false));
				break;
			case "red_or_black":
				setLoadingStage(true);
				signedBusRideActor.make_guess_red_or_black(option)
					.then((response: any) => {
						questionResponse = response;
						handleQuestionResponse();
					})
					.catch((erorr: any) => console.log(erorr))
					.finally(() => setLoadingStage(false));
				break;
			default:
				new Error("Invalid stage for Question");
		}

		function handleQuestionResponse() {
			setUserState(questionResponse);
			if (questionResponse?.stage === "end_game_win") {
				signedBusRideActor.get_user_winnings()
					.then((winnings: any) => setWinnings(winnings))
					.catch((erorr: any) => console.log(erorr))
					.finally(() => {
						setUserData(prev => ({ ...prev, balance: userData.balance + Number(winningsAmount) }));
						setAmount('-');
						// setWinningsAmount('');
					})
			}
			if (questionResponse?.stage === undefined) {
				setStage("loading");
			} else {
				setStage(questionResponse.stage);
			}
		}
	};


	const cashoutMultipliers: Record<string, number> = {
		"higher_or_lower": 2,
		"between_or_outside": 1.5 * 2,
		"suits": 1.5 * 1.5 * 2,
		// "end_game_win": 4 * 1.5 * 1.5 * 2,
	};

	const questionComponent = (
		<section className="playing-field">
			<div className="playing-field__inner">
				{loadingStage && (
					<div className="game-loader">
						<span style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)' }}>
							<Loader />
						</span>
					</div>
				)}
				<Question
					userState={userState}
					setStage={setStage}
					handleQuestion={handleQuestion}
					winningsAmount={Number(winningsAmount)}
					winnings={winnings}
					onSetBetAmount={setBetAmount}
					onSetAmount={setAmount}
					onSetWinnings={setWinningsAmount}
				>
					<PlayingCards userState={userState} />
				</Question>
			</div>
		</section>
	)

	const stages = [
		'between_or_outside',
		'higher_or_lower',
		'suits',
		// 'end_game_win',
	];

	useEffect(() => {
		// setAmount(`${Number(Object.values({...userState?.token})[0])/decimals}`);
	}, [userState]);

	useEffect(() => {
		if (userState) {
			if (stages.includes(userState?.stage)) {
				setWinningsAmount(((Number(Object.values({ ...userState?.token })[0]) * cashoutMultipliers[String(userState?.stage)]) / decimals).toString())
			}
		}

		// if (userState?.stage === "end_game_win") {
		// 	setStage("landing");
		// }
	}, [userState?.stage]);

	const component: { [key: string]: React.ReactNode } = {
		loading: (<Loader />),
		landing: (<BettingForm
			setStage={setStage}
			setUserState={setUserState}
			signedBusRideActor={signedBusRideActor}
			handleQuestion={handleQuestion}
			betAmount={betAmount}
			onSetBetAmount={setBetAmount}
			onSetAmount={setAmount}
			errorMessage={errorMessage}
			setErrorMessage={setErrorMessage}
		/>),
		red_or_black: <>{questionComponent}</>,
		higher_or_lower: <>{questionComponent}</>,
		between_or_outside: <>{questionComponent}</>,
		suits: <>{questionComponent}</>,
		end_game_loss: <>{questionComponent}</>,
		end_game_win: <>{questionComponent}</>,
	}

	let isCashOutDisabled = true;

	if (userState) {
		isCashOutDisabled = !stages.includes(userState?.stage);
	}

	const [isCashOutPopup, setIsCashOutPopup] = useState(false);

	const handleCashOut = () => {
		handleQuestion("cashout");
		setIsCashOutPopup(false);
	}

	//JSX
	return (
		<div className="App">
			{isCashOutPopup && (
				<ScreenBlur>
					<CashOutPopup
						money={Number(winningsAmount)}
						onClick={handleCashOut}
						onClose={() => setIsCashOutPopup(false)}
					/>
				</ScreenBlur>
			)}
			<div className="top-bar">
				<ToastContainer />
			</div>
			<div className="ride-the-bus__navbar">
				<ArcadeNavbar />
			</div>
			<main className="game-field">
				<GameStatus
					winnings={winningsAmount}
					betsInput={amount}
					isDisabledButton={isCashOutDisabled}
					onClick={() => {
						// handleQuestion("cashout");
						setIsCashOutPopup(true);
					}}
					onClose={() => { }}
				/>
				{component[stage]}
				<span className="game-field__cash-out">
					<CustomButton
						isBorderExist={true}
						isDisabled={isCashOutDisabled}
						onClick={() => setIsCashOutPopup(true)}
						backgroundColor={systemPositiveDefault}
						color={textBlack}
						backgroundColorHover={systemPositiveHover}
						paddingBlockMobile="16"
					>
						Cash Out
					</CustomButton>
				</span>
			</main>
		</div>
	);
}

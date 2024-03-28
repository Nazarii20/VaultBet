import Lottery from '@modules/Lottery/Lottery';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import useGlobal from 'src/hooks/useGlobal';


const Home = React.lazy(() => import('@modules/Home/Home'));
const HowToBet = React.lazy(() => import('@modules/HowToBet/HowToBet'));
const Portfolio = React.lazy(() => import('@modules/Portfolio/Portfolio'));
const Support = React.lazy(() => import('@modules/Support/Support'));
const Terms = React.lazy(() => import('@modules/Terms/Terms'));
const Arcade = React.lazy(() => import('@modules/Arcade/Arcade'));
const Crash = React.lazy(() => import('@modules/Arcade/Games/Crash/Crash'));
const RideTheBus = React.lazy(() => import('@modules/Arcade/Games/RideTheBus/RideTheBus'));
const Plinko = React.lazy(() => import('@modules/Arcade/Games/Plinko/Plinko'));
const GameDetails = React.lazy(() => import('@modules/Games/GameDetails/GameDetails'));
const Chat = React.lazy(() => import('@modules/Chat/Chat'));
const About = React.lazy(() => import('@modules/About/About'));

export default function Router() {
	const { arcadeGames } = useGlobal();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path='/'>
					<Route index element={<Home />} />
					<Route path='/portfolio' element={<Portfolio />} />
					<Route path='/chat' element={<Chat />} />
					<Route path='/how-to-bet' element={<HowToBet />} />
					<Route path='/games'>
						<Route index element={<Home />} />
						<Route path='/games/details/:id' element={<GameDetails />} />
					</Route>
					<Route path='/arcade'>
						<Route index element={<Arcade />} />
						<Route path='/arcade/1' element={<Crash game={arcadeGames[0]} />} />
						<Route path='/arcade/2' element={<RideTheBus game={arcadeGames[1]} />} />
						<Route path='/arcade/3' element={<Plinko game={arcadeGames[2]} />} />
					</Route>
					<Route path='/lottery'>
						<Route path=':interval' element={<Lottery />} />
					</Route>
				</Route>
				<Route path='/about' element={<About />} />
				<Route path='/terms' element={<Terms />} />
				<Route path='/support' element={<Support />} />
			</Routes>
		</Suspense>
	);
}

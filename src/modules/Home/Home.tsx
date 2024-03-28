import React, { useCallback, useEffect, useState } from 'react';
import { Box, Container, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import fixturesData from 'src/data/fixtures.json';
import { Fixture } from 'src/interfaces/fixture';
import GameCard from '@components/GameCard/GameCard';
import { useLocation, useNavigate } from 'react-router-dom';
import useGlobal from 'src/hooks/useGlobal';
import { SportsBasketball, SportsSoccer, SportsRugby, SportsFootball } from '@mui/icons-material';
import HomeTabs from '@components/HomeTabs/HomeTabs';
import LotteryCard from '@components/Lottery/LotteryCard/LotteryCard';
import Arcade from '@modules/Arcade/Arcade';
import { Usergeek } from 'usergeek-ic-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import SportFilter from '@components/SportFilter/SportFilter';
import { theme } from '@misc/theme';
import HeroSection from '@components/HeroSection/HeroSection';
import lotteryCanisterIds from '@misc/lotteryCanisterIds';
import EntertainmentSection from '@components/EntertainmentSection/EntertainmentSection';
import MarketplaceBanner from '@components/MarketplaceBanner/MarketplaceBanner';
import DisclaimerBanner from '@components/DisclaimerBanner/DisclaimerBanner';
import Footer from '@components/Footer/Footer';

const dailyLotteryCanisterId = lotteryCanisterIds.dailyLotteryCanisterId;
const weeklyLotteryCanisterId = lotteryCanisterIds.weeklyLotteryCanisterId;
const monthlyLotteryCanisterId = lotteryCanisterIds.monthlyLotteryCanisterId;

interface Sport {
	name: string;
	icon: React.ReactNode;
}

const sports: Sport[] = [
	{
		name: 'Football',
		icon: <SportsSoccer />
	},
	{
		name: 'Rugby',
		icon: <SportsRugby />
	},
	{
		name: 'Basketball',
		icon: <SportsBasketball />
	},
	{
		name: 'NFL',
		icon: <SportsFootball />
	}
];

export default function Home() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [fixtures, setFixtures] = useState<Fixture[]>(fixturesData);
	// TODO: revert
	const navigate = useNavigate();
	const { setPageTitle, tab, setTab } = useGlobal();

	const [today, setToday] = useState(false);
	const [NFL, setNFL] = useState(false);
	const [rugby, setRugby] = useState(false);
	const [basketball, setBasketball] = useState(false);
	const [premierLeague, setPremierLeague] = useState(false);
	const [championsLeague, setChampionsLeague] = useState(false);
	const [FACup, setFACup] = useState(false);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		setPageTitle(undefined);
	}, []);

	const getFixturesForSport = useCallback(
		(sport: string) => {
			return fixtures.filter(({ fixture }) => fixture.sport === sport);
		},
		[fixtures]
	);

	function renderSportGames(sport: string, games: Fixture[]) {
		const filteredGames = games.filter(f => {
			const fixtureDate = new Date(f.fixture.date).getTime();
			const currentDay = new Date().toLocaleString('en-US', { day: '2-digit' });
			const currentMonth = new Date().toLocaleString('en-US', { month: '2-digit' });
			const currentYear = new Date().getFullYear();
			const todaysDate = `${currentYear}-${currentMonth}-${currentDay}`;
			const difference = fixtureDate - Date.now();
			const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
			if (today) {
				return f.fixture.date.slice(0, 10) === todaysDate;
			}
			if (championsLeague) {
				return daysDifference <= 28 && daysDifference > -2 && f.league.name === 'UEFA Champions League';
			}
			if (premierLeague) {
				return daysDifference <= 28 && daysDifference > -2 && f.league.name === 'Premier League';
			}
			if (FACup) {
				return daysDifference <= 28 && daysDifference > -2 && f.league.name === 'FA Cup';
			} else return daysDifference <= 28 && daysDifference > -2;
		});

		if (filteredGames.length === 0) {
			return null;
		}

		return (
			<Stack>
				<Typography gutterBottom variant='h5'>
					{isSmallScreen ? null : sport}
				</Typography>
				<Grid container spacing={2} paddingBottom={2}>
					{filteredGames.map(f => {
						return (
							<Grid key={f.fixture.id} xs={12} sm={12} md={6} lg={4} item>
								<GameCard
									fixture={f}
									onClick={id => {
										Usergeek.trackEvent('Opened Sports Game - LeagueID ' + f.league.id);
										navigate(`/games/details/${id}`);
									}}
									icon={sports.find(s => s.name == sport)?.icon}
								/>
							</Grid>
						);
					})}
				</Grid>
			</Stack>
		);
	}

	function showGames() {
		if (basketball) {
			return (
				<Box p={2} width={'100%'}>
					{renderSportGames('Basketball', getFixturesForSport('basketball'))}
				</Box>
			);
		}
		if (rugby) {
			return (
				<Box p={2} width={'100%'}>
					{renderSportGames('Rugby', getFixturesForSport('rugby'))}
				</Box>
			);
		}
		if (NFL) {
			return (
				<Box p={2} width={'100%'}>
					{renderSportGames('NFL', getFixturesForSport('nfl'))}
				</Box>
			);
		}
		if (premierLeague || championsLeague || FACup) {
			return (
				<Box p={2} width={'100%'}>
					{renderSportGames('Football', getFixturesForSport('football'))}
				</Box>
			);
		} else
			return (
				<Box p={2} width={'100%'}>
					{renderSportGames('Football', getFixturesForSport('football'))}
					{renderSportGames('Basketball', getFixturesForSport('basketball'))}
					{renderSportGames('Rugby', getFixturesForSport('rugby'))}
					{renderSportGames('NFL', getFixturesForSport('nfl'))}
				</Box>
			);
	}

	function renderAllSportGames() {
		return (
			<Stack direction={isSmallScreen ? 'column' : 'row'}>
				<SportFilter
					setToday={setToday}
					setBasketball={setBasketball}
					setChampionsLeague={setChampionsLeague}
					setPremierLeague={setPremierLeague}
					setFACup={setFACup}
					setNFL={setNFL}
					setRugby={setRugby}
				/>
				{showGames()}
			</Stack>
		);
	}

	function renderLottery() {
		return isSmallScreen ? (
			<Swiper
				grabCursor={true}
				centeredSlides={true}
				slidesPerView={1.15}
				pagination={true}
				modules={[EffectCoverflow, Pagination]}>
				<SwiperSlide>
					<LotteryCard smallScreen lotteryInterval='daily' />
				</SwiperSlide>
				<SwiperSlide>
					<LotteryCard smallScreen lotteryInterval='weekly' />
				</SwiperSlide>
				<SwiperSlide>
					<LotteryCard smallScreen lotteryInterval='monthly' />
				</SwiperSlide>
			</Swiper>
		) : (
			<>
				<LotteryCard lotteryInterval='daily' />
				<LotteryCard lotteryInterval='weekly' />
				<LotteryCard lotteryInterval='monthly' />
			</>
		);
	}

	function renderArcade() {
		return (
			<>
				<Arcade />
			</>
		);
	}

	function renderLanding() {
		return (
			<div style={{ overflow: 'hidden', background: '#1A1B1E' }}>
				<div style={{
					maxWidth: 1408,
					margin: '0 auto',
					paddingInline: 18,
				}}>
						<HeroSection />
						<EntertainmentSection onSetTab={setTab} />
						<MarketplaceBanner />
						<DisclaimerBanner />
				</div>
				<Footer />
			</div>
		)
	}

	return (
		<>
			{tab !== 'home' && <HomeTabs tab={tab} setTab={setTab} />}
			{tab === 'home' && renderLanding()}
			{tab === 'sport-books' && renderAllSportGames()}
			<Container disableGutters={isSmallScreen} sx={{ display: 'flex', flexDirection: 'row' }}>
				{tab === 'lottery' && renderLottery()}
			</Container>
			{tab === 'arcade' && renderArcade()}
		</>
	);
}

import GameCard from '@components/GameCard/GameCard';
import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useGlobal from 'src/hooks/useGlobal';
import SportFilter from '@components/SportFilter/SportFilter';
import { Usergeek } from "usergeek-ic-js"

export default function Games() {
	const navigate = useNavigate();
	const { fixtures, setPageTitle } = useGlobal();
	const [today, setToday] = useState(false);
	const [NFL, setNFL] = useState(false);
	const [rugby, setRugby] = useState(false);
	const [basketball, setBasketball] = useState(false);
	const [premierLeague, setPremierLeague] = useState(false);
	const [championsLeague, setChampionsLeague] = useState(false);
	const [FACup, setFACup] = useState(false);

	return (
		<Stack direction={'row'}>
			<SportFilter setToday={setToday} setBasketball={setBasketball} setChampionsLeague={setChampionsLeague}
				setPremierLeague={setPremierLeague} setFACup={setFACup} setNFL={setNFL} setRugby={setRugby} />
			<Stack p={2} width={'100%'}>
				<Grid container spacing={2} padding={2}>
					{fixtures.map(r => {
						const fixtureDate = new Date(r.fixture.date).getTime();
						const difference = fixtureDate - Date.now();
						const currentDay = new Date().toLocaleString("en-US", { day: '2-digit' })
						const currentMonth = new Date().toLocaleString("en-US", { month: "2-digit" })
						const currentYear = new Date().getFullYear()
						const todaysDate = `${currentYear}-${currentMonth}-${currentDay}`
						const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
						if (today) {
							if ((r.fixture.date).slice(0, 10) === todaysDate) {
								return (
									<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
										<GameCard fixture={r} onClick={(id) => {
											Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
											navigate(`/games/details/${id}`)
										}} />									</Grid>
								)
							}
							else return null
						}
						else if (daysDifference <= 31 && daysDifference > -2) {
							if (NFL) {
								if (r.league.name === 'NFL') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else if (basketball) {
								if (r.league.name === 'NBA') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else if (premierLeague) {
								if (r.league.name === 'Premier League') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else if (championsLeague) {
								if (r.league.name === 'UEFA Champions League') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else if (rugby) {
								if (r.league.name === 'Rugby') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else if (FACup) {
								if (r.league.name === 'FA Cup') {
									return (
										<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
											<GameCard fixture={r} onClick={(id) => {
												Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
												navigate(`/games/details/${id}`)
											}} />										</Grid>
									)
								}
							}
							else return (
								<Grid key={r.fixture.id} xs={12} sm={12} md={6} lg={4} item>
									<GameCard fixture={r} onClick={(id) => {
										Usergeek.trackEvent("Opened Sports Game - LeagueID " + r.league.id);
										navigate(`/games/details/${id}`)
									}} />								</Grid>
							)
						}
					})}
				</Grid>
			</Stack>
		</Stack>
	);
}

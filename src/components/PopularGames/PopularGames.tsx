import GameCard from '@components/GameCard/GameCard';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fixture } from 'src/interfaces/fixture';
import { Usergeek } from "usergeek-ic-js"

interface IProps {
	fixtures: Fixture[];
}

export default function PopularGames({ fixtures }: IProps) {
	const navigate = useNavigate();
	return (
		<Box sx={{ py: 1 }}>
			{/* <Typography variant='h5'>Other popular Games</Typography> */}
			<Stack spacing={1} sx={{ pt: 1 }}>
				{fixtures.map(f => {
					const fixtureDate = new Date(f.fixture.date).getTime();
					const difference = fixtureDate - Date.now();
					const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
					if (daysDifference <= 28 && daysDifference > -2) {
						return (
							<GameCard onClick={(id) => {
								Usergeek.trackEvent("Opened Sports Game - LeagueID " + f.league.id);
								navigate(`/games/details/${id}`)
							}} small key={f.fixture.id} fixture={f} />
						)
					}
				})}
			</Stack>
		</Box>
	);
}

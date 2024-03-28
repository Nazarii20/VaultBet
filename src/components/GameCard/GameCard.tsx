import { teamCodes } from '@misc/teamCodes';
import { Card, CardHeader, Avatar, CardContent, Typography, CardActions, Box } from '@mui/material';
import React, { useState } from 'react';
import { Fixture } from 'src/interfaces/fixture';
import NFLImage from '@assets/images/nfl.png';
interface IProps {
	fixture: Fixture;
	onClick?: (id: number) => void;
	small?: boolean;
	icon?: React.ReactNode;
}

export default function GameCard({ fixture, onClick, small, icon }: IProps) {
	const [hover, setHover] = useState(false);

	return (
		<Card
			onClick={() => onClick && onClick(fixture.fixture.id)}
			onMouseOver={() => onClick && setHover(true)}
			onMouseOut={() => onClick && setHover(false)}
			style={{ background: hover ? 'rgba(182, 95, 248, 1)' : 'rgba(46, 50, 58, 0.70)', cursor: onClick ? 'pointer' : 'default' }}
		>
			{!small && <CardHeader avatar={<Avatar src={fixture.fixture.sport === "nfl" ? NFLImage : fixture.league.logo} />} title={fixture.fixture.venue?.name} subheader={fixture.fixture.venue?.city} action={icon} />}
			<CardContent>
				<Box sx={{ display: 'flex', flexGrow: 1 }}>
					<Box sx={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
						<Box sx={{ maxWidth: 64, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img width={small ? 32 : 64} src={fixture.teams.home.logo} alt='Logo' />
						</Box>
						<Typography variant={small ? 'h6' : 'h4'}>{teamCodes[fixture.teams.home.name]}</Typography>
					</Box>
					<Box sx={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Typography variant={small ? 'h6' : 'h4'}>V</Typography>
					</Box>
					<Box sx={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
						<Box sx={{ maxWidth: 64, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img width={small ? 32 : 64} src={fixture.teams.away.logo} alt='Logo' />
						</Box>
						<Typography variant={small ? 'h6' : 'h4'}>{teamCodes[fixture.teams.away.name]}</Typography>
					</Box>
				</Box>
			</CardContent>
			<CardActions sx={{ pt: 0, mt: small ? -3 : 0 }}>
				<Box sx={{ display: 'flex', flexGrow: 1, paddingTop: small ? 0 : 1, justifyContent: 'center' }}>
					<Typography variant={small ? 'caption' : 'body2'} sx={{ pt: 0 }}>
						{new Date(fixture.fixture.date).toLocaleDateString()} {new Date(fixture.fixture.date).toLocaleTimeString()} {fixture.fixture.timezone}
					</Typography>
				</Box>
			</CardActions>
		</Card>
	);
}

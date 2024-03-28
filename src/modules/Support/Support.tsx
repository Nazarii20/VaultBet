import { Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import useGlobal from 'src/hooks/useGlobal';

export default function Support() {
	const { setPageTitle } = useGlobal();

	useEffect(() => {
		setPageTitle('Support');
	}, []);

	return (
		<Stack direction='column' spacing={1}>
			<Card>
				<CardContent>
				<List>
						<ListItem>
							<ListItemText primary='All of us here at VaultBet want betting to be fun. A way to socialise, a chance to prove your powers of foresight, with the bonus of a little ICP if and when you win.'/>
						</ListItem>
						<ListItem>
							<ListItemText primary=' What we don’t want, is for betting or gaming to have a damaging effect on people’s lives. We are committed to responsible gambling and take compulsive gambling problems exceedingly seriously.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='Keep yourself aware – if it’s not fun, take action to control your play.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='Remember:' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Gambling is a form of entertainment. It is not a way to get rich quickly and pay off your debts.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Gambling is a game of chance. There are no formulas that guarantee winnings.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Make sure that the decision to gamble is your choice.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Never try to chase your losses.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Check the amounts you spend on a regular basis.' />
						</ListItem>
						<ListItem>
							<ListItemText primary='- Make sure you know the rules of the games you play.' />
						</ListItem>
				</List>
				</CardContent>
			</Card>
		</Stack>
	);
}

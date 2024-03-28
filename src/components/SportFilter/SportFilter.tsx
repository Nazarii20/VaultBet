import { Box, List, ListItemButton, ListItemText, Collapse, Typography, useMediaQuery, Stack, Avatar } from '@mui/material';
import { Today, SportsFootball, SportsRugby, SportsBasketball, SportsSoccer, ExpandLess, ExpandMore } from '@mui/icons-material';
import React, { useState } from 'react';
import { theme } from '@misc/theme';
import { SelectChangeEvent } from '@mui/material/Select';

interface IProps {
	setToday: (value: boolean) => void;
	setBasketball: (value: boolean) => void;
	setRugby: (value: boolean) => void;
	setNFL: (value: boolean) => void;
	setPremierLeague: (value: boolean) => void;
	setChampionsLeague: (value: boolean) => void;
	setFACup: (value: boolean) => void;
}

export default function SportFilter({ setToday, setBasketball,
	setChampionsLeague, setNFL, setPremierLeague, setRugby, setFACup }: IProps) {

	const [footballOpen, setFootballOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleFootballClick = () => {
		setFootballOpen(prevState => !prevState);
	};

	const handleOpen = () => {
		setMenuOpen(prevState => !prevState);
	};

	const resetSelection = () => {
		setToday(false);
		setNFL(false);
		setBasketball(false);
		setChampionsLeague(false);
		setPremierLeague(false);
		setFACup(false);
		setRugby(false);
		handleOpen();
	}

	const [selected, setSelected] = React.useState('All Sports');

	if (isSmallScreen) {
		return (
			<List>
					<ListItemButton onClick={handleOpen}>
						<ListItemText primary={selected} />
						{menuOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={menuOpen} timeout='auto' unmountOnExit>
						<List component='nav'>
							<ListItemButton onClick={() => {
								resetSelection()
								setSelected('Today')
								setToday(true)
							}}>
								<Today sx={{ pr: 1 }} />
								<ListItemText primary='Today' />
							</ListItemButton>
							<ListItemButton onClick={handleFootballClick}>
								<SportsSoccer sx={{ pr: 1 }} />
								<ListItemText primary='Football' />
								{footballOpen ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>

							<Collapse in={footballOpen} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
										resetSelection()
										setSelected('Premier League')
										setPremierLeague(true)
									}}>
										<Avatar src={"https://media-2.api-sports.io/football/leagues/39.png"} sx={{ width: '7%', height: '7%', pr: 1 }} />
										<ListItemText primary='Premier League' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
										resetSelection()
										setSelected('Champions League')
										setChampionsLeague(true)
									}}>
										<Avatar src={"https://media-2.api-sports.io/football/leagues/2.png"} sx={{ width: '7%', height: '7%', pr: 1 }} />
										<ListItemText primary='Champions League' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
										resetSelection()
										setSelected('FA Cup')
										setFACup(true)
									}}>
										<Avatar src={"https://media-2.api-sports.io/football/leagues/45.png"} sx={{ width: '7%', height: '7%', pr: 1 }} />
										<ListItemText primary='FA Cup' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
								</List>
							</Collapse>

							<ListItemButton onClick={() => {
								resetSelection()
								setSelected('Basketball')
								setBasketball(true)
							}}>
								<SportsBasketball sx={{ pr: 1 }} />
								<ListItemText primary='Basketball' />
							</ListItemButton>
							<ListItemButton onClick={() => {
								resetSelection()
								setSelected('Rugby')
								setRugby(true)
							}}>
								<SportsRugby sx={{ pr: 1 }} />
								<ListItemText primary='Rugby' />
							</ListItemButton>
							<ListItemButton onClick={() => {
								resetSelection()
								setSelected('NFL')
								setNFL(true)
							}}>
								<SportsFootball sx={{ pr: 1 }} />
								<ListItemText primary='NFL' />
							</ListItemButton>
						</List>
					</Collapse>
			</List>
		);
	}

	else {
		return (
			<>
				<Box display={'flex'} sx={{ minHeight: '86vh', width: 280, display: 'flex', flexGrow: 1, flexDirection: 'column', bgcolor: 'rgba(46, 50, 58, 0.70)', pt: 0.5, pl: 3.5 }}>
					<Typography fontStyle={'italic'} fontWeight={'bold'} pt={2}>
						Navigation
					</Typography>
					<List component='nav'>
						<ListItemButton onClick={() => {
							resetSelection()
							setToday(true)
						}}>
							<Today sx={{ pr: 1 }} />
							<ListItemText primary='Today' />
						</ListItemButton>
						<ListItemButton onClick={handleFootballClick}>
							<SportsSoccer sx={{ pr: 1 }} />
							<ListItemText primary='Football' />
							{footballOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>

						<Collapse in={footballOpen} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								<ListItemButton sx={{ pl: 4 }} onClick={() => {
									resetSelection()
									setPremierLeague(true)
								}}>
									<Avatar src={"https://media-2.api-sports.io/football/leagues/39.png"} sx={{ width: '14%', height: '14%', pr: 1 }} />
									<ListItemText primary='Premier League' sx={{ fontSize: '0.7rem' }} />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} onClick={() => {
									resetSelection()
									setChampionsLeague(true)
								}}>
									<Avatar src={"https://media-2.api-sports.io/football/leagues/2.png"} sx={{ width: '14%', height: '14%', pr: 1 }} />
									<ListItemText primary='Champions League' sx={{ fontSize: '0.7rem' }} />
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }} onClick={() => {
									resetSelection()
									setFACup(true)
								}}>
									<Avatar src={"https://media-2.api-sports.io/football/leagues/45.png"} sx={{ width: '14%', height: '14%', pr: 1 }} />
									<ListItemText primary='FA Cup' sx={{ fontSize: '0.7rem' }} />
								</ListItemButton>
							</List>
						</Collapse>

						<ListItemButton onClick={() => {
							resetSelection()
							setBasketball(true)
						}}>
							<SportsBasketball sx={{ pr: 1 }} />
							<ListItemText primary='Basketball' />
						</ListItemButton>
						<ListItemButton onClick={() => {
							resetSelection()
							setRugby(true)
						}}>
							<SportsRugby sx={{ pr: 1 }} />
							<ListItemText primary='Rugby' />
						</ListItemButton>
						<ListItemButton onClick={() => {
							resetSelection()
							setNFL(true)
						}}>
							<SportsFootball sx={{ pr: 1 }} />
							<ListItemText primary='NFL' />
						</ListItemButton>
					</List>
				</Box>
			</>
		);
	}


}


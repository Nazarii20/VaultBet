import { ChevronLeft, Twitter } from '@mui/icons-material';
import { Box, Divider, IconButton, List, ListItemButton, ListItemText, Stack, SwipeableDrawer, Typography, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usergeek } from "usergeek-ic-js"
import useGlobal from 'src/hooks/useGlobal';

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
}

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function DrawerMenu({ open, setOpen }: IProps) {
	const navigate = useNavigate();
	const { setTab } = useGlobal();

	const [lotteryOpen, setLotteryOpen] = useState(false);

	const handleLotteryClick = () => {
		setLotteryOpen(prevState => !prevState);
	};
  
	return (
		<>
			<SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS} anchor='left' open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
				<Box>
					<Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'row', background: '#1A1A1D' }}>
						<IconButton onClick={() => setOpen(false)} size='large' color='inherit' sx={{ mr: 2 }}>
							<ChevronLeft />
						</IconButton>
					</Box>
				</Box>
				<Box sx={{ minWidth: 300, display: 'flex', flexGrow: 1, flexDirection: 'column', background: '#1A1A1D' }}>
					<Box sx={{ flexGrow: 1 }}>
						<List component='nav'>
							<ListItemButton onClick={() => {
								setTab('home');
								navigate('/');
							}}>
								<ListItemText primary='Home' />
							</ListItemButton>
							<ListItemButton onClick={() => {
								Usergeek.trackEvent("Clicked Sports Book");
								navigate('/');
								setTab('sport-books');
							}}>
								<ListItemText primary='Sportsbook' />
							</ListItemButton>	

							<ListItemButton onClick={handleLotteryClick}>
							<ListItemText primary='Lottery' />
							{lotteryOpen ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>

							<Collapse in={lotteryOpen} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
								Usergeek.trackEvent("Clicked Lottery");
								navigate('/lottery/daily')
							}}>
									<ListItemText primary='Lottery Daily' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
								Usergeek.trackEvent("Clicked Lottery");
								navigate('/lottery/weekly')
							}}>
									<ListItemText primary='Lottery Weekly' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
									<ListItemButton sx={{ pl: 4 }} onClick={() => {
								Usergeek.trackEvent("Clicked Lottery");
								navigate('/lottery/monthly')
							}}>
									<ListItemText primary='Lottery Monthly' sx={{ fontSize: '0.7rem' }} />
									</ListItemButton>
								</List>
							</Collapse>
							<ListItemButton onClick={() => {
								Usergeek.trackEvent("arcade");
								navigate('/')
								setTab('arcade');
							}}>

								<ListItemText primary='Arcade' />
							</ListItemButton>
							{/* <ListItemButton onClick={() => setGamesOpen(prevState => !prevState)}>
							<ListItemText primary='Games' />
							{gamesOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
						<Collapse in={gamesOpen} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemText primary='Football' />
								</ListItemButton>
							</List>
						</Collapse> */}
							<ListItemButton onClick={() => navigate('/portfolio')}>
								<ListItemText primary='Sports Bet Portfolio' />
							</ListItemButton>
							{/* <ListItemButton onClick={() => navigate('/chat')}>
							<ListItemText primary='Chat' />
						</ListItemButton> */}
							<ListItemButton onClick={() => navigate('/how-to-bet')}>
								<ListItemText primary='How To Bet Guide' />
							</ListItemButton>
						</List>
					</Box>
					<List>
						<ListItemButton onClick={() => navigate('/about')}>
							<ListItemText primary='About' />
						</ListItemButton>
						<ListItemButton onClick={() => navigate('/terms')}>
							<ListItemText primary='Terms' />
						</ListItemButton>
						<ListItemButton onClick={() => navigate('/support')}>
							<ListItemText primary='Support' />
						</ListItemButton>
					</List>
					<Stack sx={{ pr: 2 }} spacing={1} justifyContent='flex-end' alignItems='center' direction='row'>
						<IconButton href='https://twitter.com/VaultBet' target='_blank'>
							<Twitter />
						</IconButton>
						<IconButton href='https://discord.gg/NmV6uyYm29' target='_blank'>
							<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-discord' viewBox='0 0 16 16'>
								<path d='M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z' />
							</svg>
						</IconButton>
					</Stack>
					<Divider />
					<Box sx={{ padding: 1, textAlign: 'right' }}>
						<Typography variant='caption'>© VaultBet S.R.L. All rights reserved.</Typography>
					</Box>
				</Box>
			</SwipeableDrawer>
		</>
	);
}

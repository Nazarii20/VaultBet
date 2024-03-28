import { Box, Card, CardContent, CardHeader, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import finger_point from '@assets/images/finger_point.png';
import chart from '@assets/images/chart.png';
import icp from '@assets/images/icp.png';
import logo from '@assets/images/logo.png';
import how_it_works from '@assets/images/how_it_works.png';
import React, { useEffect } from 'react';
import useGlobal from 'src/hooks/useGlobal';

export default function About() {
	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

	const { setPageTitle } = useGlobal();

	useEffect(() => {
		setPageTitle(undefined);
	}, []);

	function renderVideo() {
		

		if (isSmallScreen) {
			return(
				<iframe
						width='450'
						height='300'
						border-radius="10%"
						src='https://youtube.com/embed/dEbdTpiEICk'
						className='rounded-2xl'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
					>
					
					</iframe>
			)
		} else{
			return(
				<iframe
						width='950'
						height='550'
						src='https://youtube.com/embed/dEbdTpiEICk'
						className='rounded-2xl'
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
						>
						
					</iframe>
			)
		}
		
		

		
	}

	return (
		<Stack spacing={4} sx={{ pb: 2 }}>
			<Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<Typography sx={{ textAlign: 'center', py: 1 }} variant='h4'>
					DeFi The Odds
				</Typography>
			</Box>
			<Box sx={{ display: 'flex',flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
				<div className='aspect-w-16 aspect-h-9 relative mx-auto max-w-5xl rounded-xl'>
					{renderVideo()}
				</div>
			</Box>
			<Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'left', alignItems: 'left', marginLeft:5, marginRight:5 }}>
				<Typography sx={{ textAlign: 'left',marginLeft:10, marginRight:10 }} variant='h6'>
				At VaultBet, our mission is to empower players to take full control of their gambling experience and provide a transparent, secure, and fair marketplace for bets. We believe that every player deserves a level playing field and leverage the power of blockchain technology to provide it.
					<br />
					<br />
					The traditional gambling industry has long been characterized by opaque and inefficient systems that benefit bookies at the expense of players. By using smart contracts to enable peer-to-peer betting, we eliminate intermediaries and put players in control of their bets and their odds.
					<br />
					<br />
					We are dedicated to innovation and continuous improvement, striving to offer the most advanced and user-friendly blockchain-based gambling platform in the market and create a more vibrant, inclusive and global gambling community.
					<br />
				</Typography>
			</Box>
		</Stack>
	);
}

// import { panelsLight } from '@modules/Arcade/Games/RideTheBus/utils/variables';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import {Usergeek} from "usergeek-ic-js"

export type TabType = 'sport-books' | 'lottery' | 'arcade' | 'home';

interface IProps {
	tab: TabType;
	setTab: (tab: TabType) => void;
}

export default function HomeTabs({ tab, setTab }: IProps) {
	function getTabValue() {
		switch (tab) {
			case 'sport-books':
				return 0;
			case 'lottery':
				return 1;
			case 'arcade':
				return 2;
			default:
				return 0;
		}
	}

	function handleChange(value: number) {
		switch (value) {
			case 0:
				setTab('sport-books');
				Usergeek.trackEvent("Clicked Sports Book")
				break;
			case 1:
				setTab('lottery');
				Usergeek.trackEvent("Clicked Lottery")
				break;
			case 2:
				setTab('arcade');
				Usergeek.trackEvent("Clicked Arcade")
				break;
			default:
				setTab('sport-books');
				break;
		}
	}

	return (
		// <Box sx={{ display: 'flex', paddingLeft: '48px', backgroundColor: panelsLight }}>
		// 	<Tabs value={getTabValue()} onChange={(e, value) => handleChange(value)} variant='scrollable' scrollButtons='auto'>
		// 		<Tab style={{ color: getTabValue() === 0 ? '#FFF' : '#8C8C8C' }} label='Sportsbook' />
		// 		<Tab style={{ color: getTabValue() === 1 ? '#FFF' : '#8C8C8C' }} label='Lottery' />
		// 		<Tab style={{ color: getTabValue() === 2 ? '#FFF' : '#8C8C8C' }} label='Arcade' />
		// 	</Tabs>
		// </Box>
		<Box sx={{ bgcolor: 'rgba(46, 50, 58, 0.70)', display: 'flex', justifyContent: 'center', borderBottom: '2px solid #1A1B1E' }}>
			<Tabs value={getTabValue()} onChange={(e, value) => handleChange(value)} variant='scrollable' scrollButtons='auto'>
				<Tab style={{ color: getTabValue() === 0 ? '#FFF' : '#8C8C8C' }} label='Sportsbook' />
				<Tab style={{ color: getTabValue() === 1 ? '#FFF' : '#8C8C8C' }} label='Lottery' />
				<Tab style={{ color: getTabValue() === 2 ? '#FFF' : '#8C8C8C' }} label='Arcade' />
			</Tabs>
		</Box>
	);
}

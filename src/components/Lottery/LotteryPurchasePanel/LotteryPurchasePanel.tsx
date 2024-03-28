import './LotteryPurchasePanel.css';

import { IConnector } from '@connect2ic/core';
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

interface IProps {
	ticketsToBuy: number;
	setTicketsToBuy: (tickets: number) => void;
	loadingParticipation: boolean;
	loadingTickets: boolean;
	purchasedTickets: number;
	activeProvider: IConnector | undefined;
	onPurchase: () => void;
	smallScreen: boolean;
}

const quickPurchaseValues = [1, 5, 10];

export default function LotteryPurchasePanel({ loadingParticipation, loadingTickets, purchasedTickets, activeProvider, onPurchase, smallScreen }: IProps) {
	const [ticketsToBuy, setTicketsToBuy] = useState(0);

	function handleInputChange(input: string) {
		const pattern = /^\d+$/;

		if (input === '') {
			setTicketsToBuy(0);
			return;
		}

		if (pattern.test(input)) {
			setTicketsToBuy(Number(input));
			return;
		}
	}

	return (
		<Box width={smallScreen ? '100%' : '33%'} className={`lottery-panel ${smallScreen ? 'lottery-panel-mobile' : ''} lottery-purchase-panel`}>
			<p className='lottery-purchase-panel-label'>BUY TICKETS</p>
			<TextField
				className='lottery-purchase-panel-input-container'
				disabled={loadingParticipation || !activeProvider}
				sx={{ mb: 1 }}
				InputProps={{
					endAdornment: loadingParticipation ? <CircularProgress size={24} /> : <Typography variant='caption'>tickets</Typography>
				}}
				helperText={
					// This is causing the console error
					<Stack direction='row'>
						<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
							{loadingTickets ? <CircularProgress size={12} /> : `${purchasedTickets} ticket${purchasedTickets === 1 ? '' : 's'} bought`}
						</Box>
						{/* <Box>{Math.floor(userIcpAmount)} ticket(s) available</Box> */}
						<Box>1ICP per ticket</Box>
					</Stack>
				}
				fullWidth
				onChange={e => handleInputChange(e.target.value)}
				value={ticketsToBuy}
			/>

			<p className='lottery-purchase-panel-label'>QUICK PURCHASE</p>
			<div className='lottery-purchase-panel-button-group'>
				{quickPurchaseValues.map((value, i) => (
					<Button key={i} disabled={loadingParticipation || !activeProvider} variant='contained' onClick={() => setTicketsToBuy(value)}>
						{value.toFixed(0)}
					</Button>
				))}
			</div>

			<Button disabled={loadingParticipation || !activeProvider || ticketsToBuy <= 0} variant='contained' className='lottery-main-button' onClick={() => onPurchase()}>
				Purchase
			</Button>

			<Typography variant='caption' sx={{ marginTop: 1, textAlign: 'right', color: '#808080' }}>
				5% fee on winnings taken by VaultBet to cover platform fee
			</Typography>
		</Box>
	);
}

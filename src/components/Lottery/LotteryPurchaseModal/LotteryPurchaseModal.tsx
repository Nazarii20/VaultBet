import './LotteryPurchaseModal.css';

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';

interface IProps {
	ticketsBought: number;
	open: boolean;
	handleClose: () => void;
	smallScreen: boolean;
}

export default function LotteryPurchaseModal({ ticketsBought, open, handleClose, smallScreen }: IProps) {
	return (
		<Dialog
			className={`lottery-purchase-modal ${smallScreen ? 'lottery-panel-mobile' : ''}`}
			open={open}
			onClose={() => handleClose()}
			aria-labelledby='alert-purchase-success'
			aria-describedby='alert-purchase-success'>
			<DialogTitle id='alert-dialog-title'>Purchase Successful</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>You've successfully purchased your lottery tickets. Good luck!</DialogContentText>
				<Box textAlign='center'>
					<Typography variant='h4' className='lottery-purchase-modal-tickets'>
						{ticketsBought} TICKETS
					</Typography>
				</Box>
				<Button className='lottery-main-button' variant='contained' fullWidth onClick={() => handleClose()}>
					Continue
				</Button>
			</DialogContent>
		</Dialog>
	);
}

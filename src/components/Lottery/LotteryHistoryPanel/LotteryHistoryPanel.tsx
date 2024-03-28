import './LotteryHistoryPanel.css';

import { Principal } from '@dfinity/principal';
import { Box, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { shortAddress } from '@utils/addressHelper';
import React, { useState } from 'react';
import icpImg from '@assets/images/icp.png';

export interface Winner {
	round: number;
	owner: Principal;
	amount: number;
}

interface IProps {
	previousWinners: Winner[];
	principal: string | undefined;
	smallScreen: boolean;
}

export default function LotteryHistoryPanel({ previousWinners, principal, smallScreen }: IProps) {
	return (
		<div className={`lottery-panel lottery-history-panel ${smallScreen ? 'lottery-panel-mobile' : ''}`}>
			<Typography className='lottery-history-panel-title' variant='h5'>
				HISTORY
			</Typography>
			{previousWinners.length === 0 ? (
				<Box>
					<List>
						<ListItem>
							<ListItemText primary={'No winners yet'} />
						</ListItem>
					</List>
				</Box>
			) : (
				<div className='lottery-history-panel-table-container'>
					<Table stickyHeader className='lottery-history-panel-table'>
						<TableHead>
							<TableRow className='lottery-history-panel-table'>
								<TableCell width='65%'>
									<div>WINNERS</div>
								</TableCell>
								<TableCell width='35%'>
									<div>PROFIT</div>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{previousWinners.map((winner, i) => (
								<TableRow key={i}>
									<TableCell>{`${shortAddress(winner.owner.toString())} ${winner.owner.toString() === principal ? ' (You)' : ''}`}</TableCell>
									<TableCell className='lottery-history-profit-cell'>
										<img className='lottery-history-profit-icon' src={icpImg}></img>
										<span>{Number(winner.amount) / 100_000_000} ICP</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}

import { teamCodes } from '@misc/teamCodes';
import { BetData, BetSlipData, Orderbook, OrderbooksData } from '@modules/Games/GameDetails/GameDetails';
import { LocalOffer } from '@mui/icons-material';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { convertDecimalToFractional, getOdds, getStake } from '@utils/oddsHelper';
import React from 'react';
import useGlobal from 'src/hooks/useGlobal';
import { Fixture } from 'src/interfaces/fixture';

interface BetSideData {
	for: BetData;
	against: BetData;
}

interface IProps {
	fixture: Fixture;
	setBetSlipData: (data: BetSlipData) => void;
	orderbooks: OrderbooksData;
	small?: boolean;
}

const defaultBorder = { border: `1px solid ${grey[300]}` };

export default function GameBet({ fixture, setBetSlipData, orderbooks, small }: IProps) {
	const { notationType } = useGlobal();
	const buttonSize = small ? {maxWidth: '40px', minWidth: '40px'} : {}

	function renderHeader() {
		return (
			<TableHead>
				<TableRow>
					<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} align= 'center' sx={{...defaultBorder, fontWeight: 'bold'}}>Market</TableCell>
					<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} align='center' sx={{ ...defaultBorder, fontWeight: 'bold'}} colSpan={2}>
						For
					</TableCell>
					<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} align='center' colSpan={2} sx={{...defaultBorder, fontWeight: 'bold'}}>
						Against
					</TableCell>
				</TableRow>
			</TableHead>
		);
	}

	function renderBestOffer() {
		return (
			<TableRow>
				<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} size='small' sx={defaultBorder} />
				<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} size='small' sx={{ ...defaultBorder }} />
				<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} size='small' align='center' colSpan={2} sx={{ ...defaultBorder, border: theme => `2px solid ${theme.palette.secondary.main}`, borderBottom: 'none' }}>
					Best Offer
				</TableCell>
				<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} size='small' sx={defaultBorder} />
			</TableRow>
		);
	}

	function onClick(data: BetSlipData) {
		setBetSlipData(data);
	}

	function getNotation(value: number) {
		if (notationType === 'fractional') {
			return convertDecimalToFractional(value);
		}

		return value.toFixed(2);
	}

	function renderOptions(team: string, betSideData: BetSideData, orderbook: Orderbook, image?: string, hasBorderBottom?: boolean) {

		const forOdds = getOdds(betSideData.for.bestPremium);
		const againstOdds = getOdds(betSideData.against.bestPremium);
		const fractionalForOdds = convertDecimalToFractional(forOdds) === 'Invalid' || betSideData.for.bestVolume === 0 ? 'BID' : getNotation(forOdds);
		const fractionalAgainstOdds = convertDecimalToFractional(againstOdds) === 'Invalid' || betSideData.against.bestVolume === 0  ? 'ASK' : getNotation(againstOdds);
		return (
			<TableRow>
				<TableCell style={{ background: 'rgba(46, 50, 58, 0.7)' }} sx={{ ...defaultBorder }}>
				<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
						{image && <img width='30px' src={image} alt='Logo' />}
						{(!small || team === 'Draw') && <Box sx={{ ml: image ? 1 : 0 }}>{team}</Box>}
					</Box>
				</TableCell>
				<TableCell
				align='center'
				style={{ background: 'rgba(46, 50, 58, 0.7)' }}
				sx={{
					...defaultBorder,
				}}>
				<Button
				sx={{
					...buttonSize,
					background: '#00b073',
					color: 'white',
					borderRadius: '5px',
					transition: 'background 0.3s ease, color 0.3s ease',
					textTransform: 'none', // Set textTransform to none to prevent capitalization
					':hover': {
						background: '#00e586',
						color: 'white',
					boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)',
					},
				}}
				onClick={() => onClick({ team, data: betSideData.for, counterOffer: true, orderbook, market: 'for' })}
				>
				{small ? <LocalOffer /> : 'Counter Offer'}
				</Button>

				</TableCell>
				<TableCell
				align='center'
				style={{ background: 'rgba(46, 50, 58, 0.7)' }}
				sx={{
					...defaultBorder,
					borderLeft: theme => `2px solid ${theme.palette.secondary.main}`,
					borderBottom: hasBorderBottom ? theme => `2px solid ${theme.palette.secondary.main}` : '',
				}}>
				<Button
					sx={{
						...buttonSize,
						background: '#00b073',
						color: 'white',
						borderRadius: '5px',
						transition: 'background 0.3s ease, color 0.3s ease',
						textTransform: 'none',
						whiteSpace: 'pre-wrap', // Allow text to wrap onto multiple lines
						':hover': {
							background: '#00e586',
							color: 'white',
							boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.5)'
						}
					}}
					onClick={() => onClick({ team, data: betSideData.for, counterOffer: fractionalForOdds === 'BID', orderbook, market: 'for' })}
				>
					{fractionalForOdds}
					{fractionalForOdds === 'BID' ? undefined : (
						`\n${getStake(betSideData.for.bestPremium, betSideData.for.bestVolume).toFixed(2)} ICP`
					)}
				</Button>
			</TableCell>
				{/* against */}
				<TableCell
				style={{ background: 'rgba(46, 50, 58, 0.7)' }}
				align='center'
				sx={{
					...defaultBorder,
					borderRight: theme => `2px solid ${theme.palette.secondary.main}`,
					borderBottom: hasBorderBottom ? theme => `2px solid ${theme.palette.secondary.main}` : '',
				}}>
				<Button
					sx={{
						...buttonSize,
						background: '#005ea6',
						color: 'white',
						borderRadius: '5px',
						transition: 'background 0.3s ease, color 0.3s ease',
						textTransform: 'none',
						whiteSpace: 'pre-wrap', // Allow text to wrap onto multiple lines
						':hover': {
							background: '#2196f3', // Change to a lighter blue
							color: 'white',
							boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)',
						}
					}}
					onClick={() => onClick({ team, data: betSideData.against, counterOffer: fractionalAgainstOdds === 'ASK', orderbook, market: 'against' })}>
					{fractionalAgainstOdds}
					{fractionalAgainstOdds === 'ASK' ? undefined : (`\n${getStake(betSideData.against.bestPremium, betSideData.against.bestVolume).toFixed(2)} ICP`)}
				</Button>
			</TableCell>
			<TableCell
				style={{ background: 'rgba(46, 50, 58, 0.7)' }}
				align='center'
				sx={{
					...defaultBorder,

				}}>
				<Button
				sx={{
					...buttonSize,
					background: '#005ea6',
					color: 'white',
					borderRadius: '5px',
					transition: 'background 0.3s ease, color 0.3s ease',
					textTransform: 'none', // Set textTransform to none to prevent capitalization
					':hover': {
						background: '#2196f3', // Change to a lighter blue
						color: 'white',
						boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.2)',
					},
				}}
				onClick={() => onClick({ team, data: betSideData.against, counterOffer: true, orderbook, market: 'against' })}>
				{small ? <LocalOffer /> : 'Counter Offer'}
				</Button>

				</TableCell>
			</TableRow>
		);
	}



	if (!orderbooks.betData) {
		return <>No betdata</>;
	}


	let draw;
	if (orderbooks.betData.drawFor && orderbooks.betData.drawAgainst) {
		draw = renderOptions('Draw', { for: orderbooks.betData.drawFor, against: orderbooks.betData.drawAgainst }, 'draw')
	}

	return (
		<Table sx={{ borderRadius: theme => theme.shape.borderRadius , height: '100%', width: '100%', tableLayout: "fixed", borderCollapse: "collapse", overflow: "hidden", background: 'rgba(46, 50, 58, 0.7)' }}>
			{renderHeader()}
			<TableBody>
				{renderBestOffer()}
				{renderOptions(teamCodes[fixture.teams.home.name], { for: orderbooks.betData.teamAFor, against: orderbooks.betData.teamAAgainst }, 'teama', fixture.teams.home.logo)}
				{draw}
				{renderOptions(teamCodes[fixture.teams.away.name], { for: orderbooks.betData.teamBFor, against: orderbooks.betData.teamBAgainst }, 'teamb', fixture.teams.away.logo, true)}
			</TableBody>
		</Table>
	);
}

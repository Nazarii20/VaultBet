import './LotteryCountdown.css';

import { Box, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

import colonIcon from '../../../assets/icons/ic-colon.svg';

export type LotteryInterval = 'daily' | 'weekly' | 'monthly';

interface IProps {
	lotteryInterval: LotteryInterval;
	endTime: number;
	isStarted: boolean;
	onComplete: () => void;
}

type CountdownTimeDelta = 'days' | 'hours' | 'minutes' | 'seconds';

const intervalCountdownSegments: {
	[key in LotteryInterval]: CountdownTimeDelta[];
} = {
	daily: ['hours', 'minutes', 'seconds'],
	weekly: ['days', 'hours', 'minutes'],
	monthly: ['days', 'hours', 'minutes']
};

const countdownSegmentTitleMapping: {
	[key in CountdownTimeDelta]: string;
} = {
	days: 'Day',
	hours: 'Hour',
	minutes: 'Min',
	seconds: 'Sec'
};

export default function LotteryCountdown({ lotteryInterval, endTime, isStarted, onComplete }: IProps) {
	function renderCountdown(props: CountdownRenderProps) {
		return (
			<Box className='lottery-card-countdown-container'>
				{intervalCountdownSegments[lotteryInterval].map((timeDelta, i) => (
					<Fragment key={timeDelta}>
						<Box className='lottery-card-countdown-segment-container'>
							<Typography className='lottery-card-countdown-segment-label'>{countdownSegmentTitleMapping[timeDelta]}</Typography>
							<Typography className='lottery-card-countdown-segment-value'>{`${props[timeDelta]}`.padStart(2, '0')}</Typography>
						</Box>
						{i < 2 && <img className='lottery-card-countdown-segment-separator' src={colonIcon} />}
					</Fragment>
				))}
			</Box>
		);
	}

	return isStarted ? <Countdown date={endTime} overtime onComplete={() => onComplete()} renderer={props => renderCountdown(props)} /> : <span>'Not started yet'</span>;
}

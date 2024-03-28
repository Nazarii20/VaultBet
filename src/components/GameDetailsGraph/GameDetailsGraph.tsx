import React from 'react';
import { useState, useEffect } from 'react'
import { _SERVICE as _GAME_SERVICE } from '@declarations/game';
import { OrderbooksData } from '@modules/Games/GameDetails/GameDetails';
import { dateFromNano } from '@utils/dateHelper';
import { decimals } from '@utils/validationHelper';
import { getOdds, getStake } from '@utils/oddsHelper';
import { teamCodes } from '@misc/teamCodes';
import { Bar, Line } from 'react-chartjs-2';
import {Chart as ChartJS, registerables} from "chart.js"; 
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { Fixture } from 'src/interfaces/fixture';

ChartJS.register(...registerables); 


interface IProps {
	orderbooks: OrderbooksData;
	fixture: Fixture
}


type GraphDataObject = {
	teamAOdds: Array<GraphData>,
	teamBOdds: Array<GraphData>,
	teamAStake: Array<GraphData>,
	drawOdds: Array<GraphData> | undefined,
	drawStake: Array<GraphData> | undefined
}
type GraphData = { x: Date; y: number };


export default function Graph({orderbooks, fixture}: IProps) {


	const teamAOdds = orderbooks.teama.map(
		(t): GraphData => ({
			x: new Date(parseInt(String(t.datetime).substring(0,13))),
			y: 1/(getOdds(Number(t.buy_premium.e8s) / decimals))*100
		})
	);
	const teamBOdds = orderbooks.teama.map(
		(t): GraphData => ({
			x: new Date(parseInt(String(t.datetime).substring(0,13))),
			y: 100 - 1/(getOdds(Number(t.buy_premium.e8s) / decimals))*100
		})
	);

	const teamAStake = orderbooks.teama.map(
		(t): GraphData => ({
			x: new Date(parseInt(String(t.datetime).substring(0,13))),
			y: getStake(Number(t.buy_premium.e8s), Number(t.contracts.e8s))
		})
	);

	let drawOdds;
	let drawStake;
	if (orderbooks.draw?.length !== 0 && orderbooks.draw) {
		drawOdds = orderbooks.draw.map(
			(t): GraphData => ({
				x: new Date(parseInt(String(t.datetime).substring(0,13))),
				y: 1/(getOdds(Number(t.buy_premium.e8s) / decimals))*100
			})
		);

		drawStake = orderbooks.draw.map(
			(t): GraphData => ({
				x: new Date(parseInt(String(t.datetime).substring(0,13))),
				y: getStake(Number(t.buy_premium.e8s), Number(t.contracts.e8s))
			})
		);

	}
	let chartData: GraphDataObject = {
		teamAOdds: teamAOdds,
		teamBOdds: teamBOdds,
		teamAStake: teamAStake, 
		drawOdds: drawOdds, 
		drawStake: drawStake
	}


	if (chartData.teamAOdds.length === 0) {
		return (
			<div></div>
		)
	}
	const data = {
		datasets: [
		  {
			label: `${teamCodes[fixture.teams.home.name]} Odds`,
			data: chartData.teamAOdds,
			borderColor: 'red',
			fill: false,
			showLine: true,
		  },
		  {
			label: `${teamCodes[fixture.teams.away.name]} Odds`,
			data: chartData.teamBOdds,
			borderColor: 'blue',
			fill: false,
			showLine: true,
		  },		  
		  {
			label: 'Draw Odds',
			data: chartData.drawOdds,
			borderColor: 'purple',
			fill: false,
		  }
		//   {
		// 	label: 'Team A Stake',
		// 	data: chartData.teamAStake,
		// 	borderColor: 'green',
		// 	fill: false,
		//   },

		//   {
		// 	label: 'Draw Stake',
		// 	data: chartData.drawStake,
		// 	borderColor: 'orange',
		// 	fill: false,
		//   },
		],
	  };
	
	  const options = {
		scales: {
		  x: {
			type: 'time' as const,
			time: {
			  unit: 'minute' as const,
			},
			adapters: { 
			  date: {
				locale: enUS, 
			  },
			}, 
		  },
		  y: {
			title: {
				display: true,
				text: 'Implied Probability %',
			  },
		  }
		},
	  };
	
	  return <Line data={data} options={options} />;
	}


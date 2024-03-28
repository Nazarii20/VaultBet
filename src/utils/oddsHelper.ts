import * as oddslib from 'oddslib';

export function getOdds(premium: number) {
	const odds = 1 / premium;
	return odds;
}

// export function getOdds(premium: number, numOfContracts: number) {
// 	const odds = (premium * numOfContracts) / ((1 - premium) * numOfContracts);
// 	return odds + 1;
// }

export function getStake(premium: number, numOfContracts: number) {
	return premium * numOfContracts;
}

export function getPremium(odds: number) {
	return 1 / odds;
}

// export function getVolume() {
// 	premium * amountOfContracts; // buy
// 	(1 - premium) * amountOfContracts; // sell
// }

export function getNumberOfContracts(premium: number, stake: number) {
	return Number((stake / premium).toFixed(0));
}

export function getReturn(odds: number, stake: number) {
	return odds * stake;
}

export function getClosestStake(odds: number, stake: number) {
	const premium = getPremium(odds);
	let numOfContracts = Math.round(getNumberOfContracts(premium, stake));
	if (numOfContracts < 1) {
		numOfContracts = 1;
	}
	const closestPossibleStake = getStake(premium, numOfContracts);
	return isNaN(closestPossibleStake) ? 0 : closestPossibleStake;
}

// // Only use this function for user interface don't use it when doing any calculations
// export function convertDecimalToFractional(decimalOdds: number) {
// 	return oddsCon.decimal.toFractional(1 + decimalOdds).simplify();
// }

// // Use this function if the user asks for it or if you need to do any calculations
// export function convertFractionalToDecimal(numerator: number, denominator: number) {
// 	return oddsCon.fraction.toDecimal(numerator, denominator); // 1.2;
// }

// Only use this function for user interface don't use it when doing any calculations
export function convertDecimalToFractional(value: number): string {
	if (isNaN(value)) {
		return 'N/A';
	}
	if (value < 1.02) {
		return `Invalid`
	}
	try {
		return oddslib.from('decimal', value).to('fractional', { precision: 2 });
	} catch (error) {
		return `Invalid`;
	}
}

// Use this function if the user asks for it or if you need to do any calculations
export function convertFractionalToDecimal(value: number[]): number {
	if (isNaN(value[0])) {
		return 1;
	}
	return oddslib.from('fractional', value.join('/')).to('decimal');
}

import { Principal } from '@dfinity/principal';
import bigDecimal from 'js-big-decimal';

export function sanitizeDecimalInput(amount: string, callback: (value: string) => void) {
	if (!amount || amount.match(/^\d{1,}(\.\d{0,8})?$/)) {
		callback(amount);
	}
}

export function sanitizeOddsDecimalInput(amount: string, callback: (value: string) => void) {
	if (!amount || (amount.match(/^\d{1,}(\.\d{0,2})?$/) && parseFloat(amount) <= 50)) {
		callback(amount);
	}
}

export function sanitizeStakeDecimalInput(amount: string, callback: (value: string) => void) {
	if (!amount || (amount.match(/^\d{1,}(\.\d{0,2})?$/) && Number(amount) >= 0)) {
		callback(amount);
	}
}

export function disableDecimals(amount: string, callback: (value: string) => void) {
	if (!amount || (amount.match(/^\d{1,}?$/) && Number(amount) > 0)) {
		callback(amount);
	}
}

export function getPrettyDecimals(amount: bigint | number) {
	const value = new bigDecimal(Number(Number(amount) / decimals).toFixed(3)).getPrettyValue(3, ',');
	return value;
}

export const decimals = 100000000;

export function validatePrincipal(principal: string, callback: (principal: string, isValid: boolean) => void) {
	try {
		Principal.fromText(principal);
		callback(principal, true);
	} catch (error) {
		callback(principal, false);
	}
}

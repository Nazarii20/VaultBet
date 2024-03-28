import { _SERVICE } from '@declarations/orderbook';

export interface PortfolioItem {
	orderId: bigint;
	match: string;
	prediction: string | undefined;
	stake: string;
	odds: String;
	totalPrice: string | undefined;
	potentialPayout: string | undefined;
	result: string | undefined;
	orderbookActor: _SERVICE
}
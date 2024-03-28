import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Err =
	| { OngoingRequired: null }
	| { FinalizerOrAdminRequired: null }
	| { NotExistingOrder: null }
	| { OrderBookNotFinalized: null }
	| { AdminRequired: null }
	| { NotOpenOrder: null }
	| { IcpErrorMessage: string }
	| { ValidPremiumRequired: null }
	| { InvalidUser: null }
	| { BalanceLow: null }
	| { UserNotFound: null };
export interface Order {
	id: bigint;
	original_amount: Tokens;
	premium: Tokens;
	side: OrderSide;
	user: Principal;
	current_amount: Tokens;
	state: OrderState;
}
export type OrderSide = { Buy: null } | { Sell: null };
export type OrderState = { Open: null } | { Close: null } | { Cancel: null };
export interface Quote {
	buy_premium: Tokens;
	contracts: Tokens;
	datetime: bigint;
}
export type Result = { Ok: Order } | { Err: Err };
export type Result_1 = { Ok: null } | { Err: Err };
export type Result_2 = { Ok: Tokens } | { Err: Err };
export type Result_3 = { Ok: Uint8Array | number[] } | { Err: Err };
export type Result_4 = { Ok: Array<Order> } | { Err: Err };
export interface Tokens {
	e8s: bigint | number;
}
export interface _SERVICE {
	cancelOrder: ActorMethod<[bigint], Result>;
	finalizeWithCanceledGame: ActorMethod<[], Result_1>;
	finalizeWithLongPositionWon: ActorMethod<[], Result_1>;
	finalizeWithNonePositionWon: ActorMethod<[], Result_1>;
	finalizeWithShortPositionWon: ActorMethod<[], Result_1>;
	getAvailable: ActorMethod<[], Result_2>;
	getBestBuyPremium: ActorMethod<[], Tokens>;
	getBestBuyVolume: ActorMethod<[], Tokens>;
	getBestSellPremium: ActorMethod<[], Tokens>;
	getBestSellVolume: ActorMethod<[], Tokens>;
	getCommittedCommissions: ActorMethod<[], Result_2>;
	getCommittedInOrders: ActorMethod<[], Result_2>;
	getCommittedInPositions: ActorMethod<[], Result_2>;
	getDepositAddress: ActorMethod<[], Result_3>;
	getDeposited: ActorMethod<[], Result_2>;
	getHistoricalQuotes: ActorMethod<[], Array<Quote>>;
	getLongPositionContracts: ActorMethod<[], Result_2>;
	getLongPositionTotalCost: ActorMethod<[], Result_2>;
	getOrders: ActorMethod<[], Result_4>;
	getShortPositionContracts: ActorMethod<[], Result_2>;
	getShortPositionTotalCost: ActorMethod<[], Result_2>;
	getSpendedCommissions: ActorMethod<[], Result_2>;
	getSubaccountBalance: ActorMethod<[], Result_2>;
	getTotalAvailable: ActorMethod<[], Tokens>;
	getTotalCommittedCommissions: ActorMethod<[], Tokens>;
	getTotalCommittedInOrders: ActorMethod<[], Tokens>;
	getTotalCommittedInPositions: ActorMethod<[], Tokens>;
	getTotalDeposited: ActorMethod<[], Tokens>;
	getTotalHouseWithdrawn: ActorMethod<[], Tokens>;
	getTotalLedgerFeePayment: ActorMethod<[], Tokens>;
	getTotalSpendedCommissions: ActorMethod<[], Tokens>;
	getTotalUsersWithdrawn: ActorMethod<[], Tokens>;
	getWithdrawn: ActorMethod<[], Result_2>;
	placeOrderBuy: ActorMethod<[Tokens, Tokens], Result>;
	placeOrderSell: ActorMethod<[Tokens, Tokens], Result>;
	withdrawAll: ActorMethod<[], Result_1>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const Tokens = IDL.Record({ e8s: IDL.Nat64 });
	const OrderSide = IDL.Variant({ Buy: IDL.Null, Sell: IDL.Null });
	const OrderState = IDL.Variant({
		Open: IDL.Null,
		Close: IDL.Null,
		Cancel: IDL.Null
	});
	const Order = IDL.Record({
		id: IDL.Nat64,
		original_amount: Tokens,
		premium: Tokens,
		side: OrderSide,
		user: IDL.Principal,
		current_amount: Tokens,
		state: OrderState
	});
	const Err = IDL.Variant({
		OngoingRequired: IDL.Null,
		FinalizerOrAdminRequired: IDL.Null,
		NotExistingOrder: IDL.Null,
		OrderBookNotFinalized: IDL.Null,
		AdminRequired: IDL.Null,
		NotOpenOrder: IDL.Null,
		IcpErrorMessage: IDL.Text,
		ValidPremiumRequired: IDL.Null,
		InvalidUser: IDL.Null,
		BalanceLow: IDL.Null,
		UserNotFound: IDL.Null
	});
	const Result = IDL.Variant({ Ok: Order, Err: Err });
	const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: Err });
	const Result_2 = IDL.Variant({ Ok: Tokens, Err: Err });
	const Result_3 = IDL.Variant({ Ok: IDL.Vec(IDL.Nat8), Err: Err });
	const Quote = IDL.Record({
		buy_premium: Tokens,
		contracts: Tokens,
		datetime: IDL.Nat64
	});
	const Result_4 = IDL.Variant({ Ok: IDL.Vec(Order), Err: Err });
	return IDL.Service({
		cancelOrder: IDL.Func([IDL.Nat64], [Result], []),
		finalizeWithCanceledGame: IDL.Func([], [Result_1], []),
		finalizeWithLongPositionWon: IDL.Func([], [Result_1], []),
		finalizeWithNonePositionWon: IDL.Func([], [Result_1], []),
		finalizeWithShortPositionWon: IDL.Func([], [Result_1], []),
		getAvailable: IDL.Func([], [Result_2], ['query']),
		getBestBuyPremium: IDL.Func([], [Tokens], ['query']),
		getBestBuyVolume: IDL.Func([], [Tokens], ['query']),
		getBestSellPremium: IDL.Func([], [Tokens], ['query']),
		getBestSellVolume: IDL.Func([], [Tokens], ['query']),
		getCommittedCommissions: IDL.Func([], [Result_2], ['query']),
		getCommittedInOrders: IDL.Func([], [Result_2], ['query']),
		getCommittedInPositions: IDL.Func([], [Result_2], ['query']),
		getDepositAddress: IDL.Func([], [Result_3], []),
		getDeposited: IDL.Func([], [Result_2], ['query']),
		getHistoricalQuotes: IDL.Func([], [IDL.Vec(Quote)], ['query']),
		getLongPositionContracts: IDL.Func([], [Result_2], ['query']),
		getLongPositionTotalCost: IDL.Func([], [Result_2], ['query']),
		getOrders: IDL.Func([], [Result_4], ['query']),
		getShortPositionContracts: IDL.Func([], [Result_2], ['query']),
		getShortPositionTotalCost: IDL.Func([], [Result_2], ['query']),
		getSpendedCommissions: IDL.Func([], [Result_2], ['query']),
		getSubaccountBalance: IDL.Func([], [Result_2], []),
		getTotalAvailable: IDL.Func([], [Tokens], ['query']),
		getTotalCommittedCommissions: IDL.Func([], [Tokens], ['query']),
		getTotalCommittedInOrders: IDL.Func([], [Tokens], ['query']),
		getTotalCommittedInPositions: IDL.Func([], [Tokens], ['query']),
		getTotalDeposited: IDL.Func([], [Tokens], ['query']),
		getTotalHouseWithdrawn: IDL.Func([], [Tokens], ['query']),
		getTotalLedgerFeePayment: IDL.Func([], [Tokens], ['query']),
		getTotalSpendedCommissions: IDL.Func([], [Tokens], ['query']),
		getTotalUsersWithdrawn: IDL.Func([], [Tokens], ['query']),
		getWithdrawn: IDL.Func([], [Result_2], ['query']),
		placeOrderBuy: IDL.Func([Tokens, Tokens], [Result], []),
		placeOrderSell: IDL.Func([Tokens, Tokens], [Result], []),
		withdrawAll: IDL.Func([], [Result_1], [])
	});
};

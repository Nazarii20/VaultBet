import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Err =
	| { FailedToDetermineWinner: null }
	| { AdminRequired: null }
	| { OrderBookCloseFailed: null }
	| { GameNotFound: null }
	| { LeagueNotFound: null }
	| { HTTPRequestFailed: bigint }
	| { ApiBadResponse: null };
export interface Game {
	league_id: bigint;
	fast_refresh: boolean;
	draw_order_book: [] | [Principal];
	game_status: GameStatus;
	match_id: bigint;
	teama_order_book: Principal;
}
export type GameStatus = { Paused: null } | { Ongoing: null } | { Finished: null } | { Postponed: null } | { Scheduled: null } | { Cancelled: null };
export type Result = { Ok: Game } | { Err: Err };
export type Result_1 = { Ok: null } | { Err: Err };
export type Result_2 = { Ok: Array<Game> } | { Err: Err };
export interface _SERVICE {
	createGame: ActorMethod<[bigint, bigint, Principal, [] | [Principal]], Result>;
	createLeague: ActorMethod<[bigint, string, string], Result_1>;
	fetchGames: ActorMethod<[], Result_1>;
	getAllLogs: ActorMethod<[], Array<string>>;
	getFinishedGames: ActorMethod<[], Array<Game>>;
	getGame: ActorMethod<[bigint, bigint], Result>;
	getGamesFromLeague: ActorMethod<[bigint], Result_2>;
	getLast100Logs: ActorMethod<[], Array<string>>;
	getPendingGames: ActorMethod<[], Array<Game>>;
	panicGame: ActorMethod<[bigint, bigint], Result_1>;
	panicLeague: ActorMethod<[bigint], Result_1>;
}

export const idlFactory = ({ IDL }: any) => {
	const GameStatus = IDL.Variant({
		Paused: IDL.Null,
		Ongoing: IDL.Null,
		Finished: IDL.Null,
		Postponed: IDL.Null,
		Scheduled: IDL.Null,
		Cancelled: IDL.Null
	});
	const Game = IDL.Record({
		league_id: IDL.Nat64,
		fast_refresh: IDL.Bool,
		draw_order_book: IDL.Opt(IDL.Principal),
		game_status: GameStatus,
		match_id: IDL.Nat64,
		teama_order_book: IDL.Principal
	});
	const Err = IDL.Variant({
		FailedToDetermineWinner: IDL.Null,
		AdminRequired: IDL.Null,
		OrderBookCloseFailed: IDL.Null,
		GameNotFound: IDL.Null,
		LeagueNotFound: IDL.Null,
		HTTPRequestFailed: IDL.Nat64,
		ApiBadResponse: IDL.Null
	});
	const Result = IDL.Variant({ Ok: Game, Err: Err });
	const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: Err });
	const Result_2 = IDL.Variant({ Ok: IDL.Vec(Game), Err: Err });
	return IDL.Service({
		createGame: IDL.Func([IDL.Nat64, IDL.Nat64, IDL.Principal, IDL.Opt(IDL.Principal)], [Result], []),
		createLeague: IDL.Func([IDL.Nat64, IDL.Text, IDL.Text], [Result_1], []),
		fetchGames: IDL.Func([], [Result_1], []),
		getAllLogs: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
		getFinishedGames: IDL.Func([], [IDL.Vec(Game)], ['query']),
		getGame: IDL.Func([IDL.Nat64, IDL.Nat64], [Result], ['query']),
		getGamesFromLeague: IDL.Func([IDL.Nat64], [Result_2], ['query']),
		getLast100Logs: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
		getPendingGames: IDL.Func([], [IDL.Vec(Game)], ['query']),
		panicGame: IDL.Func([IDL.Nat64, IDL.Nat64], [Result_1], []),
		panicLeague: IDL.Func([IDL.Nat64], [Result_1], [])
	});
};

import { Principal } from '@dfinity/principal';

export interface Tokens {
	e8s: bigint;
}
export interface _SERVICE {
	__get_candid_interface_tmp_hack: () => Promise<string>;
	get_canister_balance: () => Promise<Tokens>;
	get_current_round: () => Promise<bigint>;
	get_end_time: () => Promise<bigint>;
	get_last_winners: (arg_0: bigint) => Promise<Array<[bigint, Principal, Tokens]>>;
	get_logs: () => Promise<Array<[bigint, [bigint, bigint, string]]>>;
	get_tickets_for_round: (arg_0: bigint) => Promise<Array<bigint>>;
	is_started: () => Promise<boolean>;
	join_raffle: (arg_0: bigint) => Promise<[] | [Array<bigint>]>;
	reset_timer: () => Promise<string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const Tokens = IDL.Record({ e8s: IDL.Nat64 });
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
		get_canister_balance: IDL.Func([], [Tokens], []),
		get_current_round: IDL.Func([], [IDL.Nat64], ['query']),
		get_end_time: IDL.Func([], [IDL.Nat64], ['query']),
		get_last_winners: IDL.Func([IDL.Nat64], [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Principal, Tokens))], ['query']),
		get_logs: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Tuple(IDL.Nat64, IDL.Nat64, IDL.Text)))], ['query']),
		get_tickets_for_round: IDL.Func([IDL.Nat64], [IDL.Vec(IDL.Nat64)], ['query']),
		is_started: IDL.Func([], [IDL.Bool], ['query']),
		join_raffle: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Vec(IDL.Nat64))], []),
		reset_timer: IDL.Func([], [IDL.Text], [])
	});
};

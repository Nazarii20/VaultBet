import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Card { 'rank' : bigint, 'suit' : string }
export interface Cards {
  'card_1' : Card,
  'card_2' : Card,
  'card_3' : Card,
  'card_4' : Card,
}
export type Token = { 'YC' : bigint } |
  { 'BOX' : bigint } |
  { 'HOT' : bigint } |
  { 'ICP' : bigint } |
  { 'SOC' : bigint } |
  { 'TRT' : bigint } |
  { 'VBT' : bigint } |
  { 'XTC' : bigint } |
  { 'GHOST' : bigint } |
  { 'CHAT' : bigint } |
  { 'SNS1' : bigint } |
  { 'WICP' : bigint } |
  { 'KINIC' : bigint } |
  { 'CKBTC' : bigint } |
  { 'VBT' : bigint } |
  { 'CKETH' : bigint };
export interface UserState {
  'token' : Token,
  'cards' : Cards,
  'deck' : Array<Card>,
  'stage' : string,
  'start_time' : string,
}
export interface _SERVICE {
  '_get_user_state' : ActorMethod<[Principal], UserState>,
  'delete_old_users' : ActorMethod<[], undefined>,
  'delete_user' : ActorMethod<[Principal], undefined>,
  'get_stage' : ActorMethod<[], string>,
  'get_user_state' : ActorMethod<[], UserState>,
  'get_user_winnings' : ActorMethod<[], Token>,
  'make_guess_between_or_outside' : ActorMethod<[string], UserState>,
  'make_guess_higher_or_lower' : ActorMethod<[string], UserState>,
  'make_guess_red_or_black' : ActorMethod<[string], UserState>,
  'make_guess_suit' : ActorMethod<[string], UserState>,
  'place_bet' : ActorMethod<[Token], UserState>,
  'update_user_winnings' : ActorMethod<[], Token>,
  'user_state' : ActorMethod<[Principal], UserState>,
}

export const idlFactory = ({ IDL }: any) => {
  const Token = IDL.Variant({
    'YC' : IDL.Nat,
    'BOX' : IDL.Nat,
    'HOT' : IDL.Nat,
    'ICP' : IDL.Nat,
    'SOC' : IDL.Nat,
    'TRT' : IDL.Nat,
    'VBT' : IDL.Nat,
    'XTC' : IDL.Nat,
    'GHOST' : IDL.Nat,
    'CHAT' : IDL.Nat,
    'SNS1' : IDL.Nat,
    'WICP' : IDL.Nat,
    'KINIC' : IDL.Nat,
    'CKBTC' : IDL.Nat,
    'CKETH' : IDL.Nat,
  });
  const Card = IDL.Record({ 'rank' : IDL.Int, 'suit' : IDL.Text });
  const Cards = IDL.Record({
    'card_1' : Card,
    'card_2' : Card,
    'card_3' : Card,
    'card_4' : Card,
  });
  const UserState = IDL.Record({
    'token' : Token,
    'cards' : Cards,
    'deck' : IDL.Vec(Card),
    'stage' : IDL.Text,
    'start_time' : IDL.Text,
  });
  return IDL.Service({
    '_get_user_state' : IDL.Func([IDL.Principal], [UserState], ['query']),
    'delete_old_users' : IDL.Func([], [], []),
    'delete_user' : IDL.Func([IDL.Principal], [], []),
    'get_stage' : IDL.Func([], [IDL.Text], ['query']),
    'get_user_state' : IDL.Func([], [UserState], ['query']),
    'get_user_winnings' : IDL.Func([], [Token], ['query']),
    'make_guess_between_or_outside' : IDL.Func([IDL.Text], [UserState], []),
    'make_guess_higher_or_lower' : IDL.Func([IDL.Text], [UserState], []),
    'make_guess_red_or_black' : IDL.Func([IDL.Text], [UserState], []),
    'make_guess_suit' : IDL.Func([IDL.Text], [UserState], []),
    'place_bet' : IDL.Func([Token], [UserState], []),
    'update_user_winnings' : IDL.Func([], [Token], []),
    'user_state' : IDL.Func([IDL.Principal], [UserState], ['query']),
  });
};

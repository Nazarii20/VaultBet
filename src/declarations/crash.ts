import type { Principal } from '@dfinity/principal';

export interface Bet {
  'multiplier' : [] | [number],
  'token' : Token__1,
  'owner' : Principal,
  'isCashout' : boolean,
}
export interface Multiplier { 'token' : string, 'value' : string }
export type Result = { 'Ok' : bigint } |
  { 'Err' : TransferError };
export type Result_2 = { 'Ok' : bigint } |
  { 'Err' : TransferFromError };
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
  { 'CKETH' : bigint };
export type TokenResult = { 'ICRC' : Result } |
  { 'ICRC2' : Result_2 } |
  { 'DIP20' : TxReceipt };
export type Token__1 = { 'YC' : bigint } |
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
  { 'CKETH' : bigint };
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TxReceipt = { 'Ok' : bigint } |
  {
    'Err' : { 'AccountNotFound' : null } |
      { 'InsufficientAllowance' : null } |
      { 'InsufficientBalance' : null } |
      { 'ActiveProposal' : null } |
      { 'ErrorOperationStyle' : null } |
      { 'Unauthorized' : null } |
      { 'LedgerTrap' : null } |
      { 'ErrorTo' : null } |
      { 'Other' : string } |
      { 'BlockUsed' : null } |
      { 'AmountTooSmall' : null }
  };
export interface _SERVICE {
  'bet' : (arg_0: Token, arg_1: [] | [string]) => Promise<string>,
  'balanceOf' : (arg_0: Token) => Promise<bigint>,
  'canisterBalance' : (arg_0: Token) => Promise<bigint>,
  'cashout' : (arg_0: string) => Promise<undefined>,
  'commitDeposit' : (arg_0: Token) => Promise<Array<number>>,
  'deposit' : (arg_0: Token, arg_1: [] | [bigint]) => Promise<TokenResult>,
  'fechBets' : () => Promise<Array<Bet>>,
  'fechCrashHistory' : () => Promise<Array<[number, number]>>,
  'fechHistory' : () => Promise<Array<[number, Array<Bet>]>>,
  'fechHistoryByRounf' : (arg_0: number) => Promise<Array<Bet>>,
  'fechUUIDs' : () => Promise<Array<[string, Principal]>>,
  'getMaxBet' : (arg_0: Token) => Promise<bigint>,
  'getMaxProfit' : (arg_0: Token) => Promise<bigint>,
  'manualCashout' : (arg_0: Multiplier) => Promise<bigint>,
  'setBettingPhase' : () => Promise<undefined>,
  'setCashOutPhase' : () => Promise<undefined>,
  'setGamePhase' : () => Promise<undefined>,
  'setMaxBet' : (arg_0: Token) => Promise<undefined>,
  'setMaxProfit' : (arg_0: Token) => Promise<undefined>,
  'takeProfit' : (arg_0: Token, arg_1: Principal) => Promise<TokenResult>,
  'totalBalance' : (arg_0: Token) => Promise<bigint>,
  'withdraw' : (arg_0: Token) => Promise<TokenResult>,
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferError });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferFromError });
  const TxReceipt = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : IDL.Variant({
      'AccountNotFound' : IDL.Null,
      'InsufficientAllowance' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'ActiveProposal' : IDL.Null,
      'ErrorOperationStyle' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'LedgerTrap' : IDL.Null,
      'ErrorTo' : IDL.Null,
      'Other' : IDL.Text,
      'BlockUsed' : IDL.Null,
      'AmountTooSmall' : IDL.Null,
    }),
  });
  const TokenResult = IDL.Variant({
    'ICRC' : Result,
    'ICRC2' : Result_2,
    'DIP20' : TxReceipt,
  });
  const Token__1 = IDL.Variant({
    'YC' : IDL.Nat,
    'BOX' : IDL.Nat,
    'HOT' : IDL.Nat,
    'ICP' : IDL.Nat,
    'SOC' : IDL.Nat,
    'TRT' : IDL.Nat,
    'XTC' : IDL.Nat,
    'GHOST' : IDL.Nat,
    'CHAT' : IDL.Nat,
    'SNS1' : IDL.Nat,
    'WICP' : IDL.Nat,
    'KINIC' : IDL.Nat,
    'CKBTC' : IDL.Nat,
    'CKETH' : IDL.Nat,
    'VBT' : IDL.Nat,
  });
  const Bet = IDL.Record({
    'multiplier' : IDL.Opt(IDL.Float64),
    'token' : Token__1,
    'owner' : IDL.Principal,
    'isCashout' : IDL.Bool,
  });
  const Multiplier = IDL.Record({ 'token' : IDL.Text, 'value' : IDL.Text });
  return IDL.Service({
    'bet' : IDL.Func([Token, IDL.Opt(IDL.Text)], [IDL.Text], []),
    'balanceOf' : IDL.Func([Token], [IDL.Nat], ['query']),
    'canisterBalance' : IDL.Func([Token], [IDL.Nat], []),
    'cashout' : IDL.Func([IDL.Text], [], []),
    'commitDeposit' : IDL.Func([Token], [IDL.Vec(IDL.Nat8)], []),
    'deposit' : IDL.Func([Token, IDL.Opt(IDL.Nat)], [TokenResult], []),
    'fechBets' : IDL.Func([], [IDL.Vec(Bet)], ['query']),
    'fechCrashHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Float64))],
        ['query'],
      ),
    'fechHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Vec(Bet)))],
        ['query'],
      ),
    'fechHistoryByRounf' : IDL.Func([IDL.Nat32], [IDL.Vec(Bet)], ['query']),
    'fechUUIDs' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal))],
        ['query'],
      ),
    'getMaxBet' : IDL.Func([Token], [IDL.Nat], []),
    'getMaxProfit' : IDL.Func([Token], [IDL.Nat], []),
    'manualCashout' : IDL.Func([Multiplier], [IDL.Nat], []),
    'setBettingPhase' : IDL.Func([], [], []),
    'setCashOutPhase' : IDL.Func([], [], []),
    'setGamePhase' : IDL.Func([], [], []),
    'setMaxBet' : IDL.Func([Token], [], []),
    'setMaxProfit' : IDL.Func([Token], [], []),
    'setServer' : IDL.Func([IDL.Principal], [], []),
    'takeProfit' : IDL.Func([Token, IDL.Principal], [TokenResult], []),
    'totalBalance' : IDL.Func([Token], [IDL.Nat], []),
    'withdraw' : IDL.Func([Token], [TokenResult], []),
  });
};

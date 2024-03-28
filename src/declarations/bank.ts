import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
  'addBalance' : ActorMethod<[Principal, Token], undefined>,
  'add_or_remove_game' : ActorMethod<[Principal], undefined>,
  'getBalance' : ActorMethod<[Token], bigint>,
  'balanceOf' : ActorMethod<[Token], bigint>,
  'balanceOfUser' : ActorMethod<[Principal, Token], bigint>,
  'commitDeposit' : ActorMethod<[Token], Uint8Array | number[]>,
  'deposit' : ActorMethod<[Token, [] | [bigint]], TokenResult>,
  'fetchGames' : ActorMethod<[], Array<Principal>>,
  'setBalance' : ActorMethod<[Principal, Token], undefined>,
  'totalBalance' : ActorMethod<[Token], bigint>,
  'withdraw' : ActorMethod<[Token], TokenResult>,
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
  return IDL.Service({
    'addBalance' : IDL.Func([IDL.Principal, Token], [], []),
    'add_or_remove_game' : IDL.Func([IDL.Principal], [], []),
    'getBalance' : IDL.Func([Token], [IDL.Nat], []),
    'balanceOf' : IDL.Func([Token], [IDL.Nat], ['query']),
    'balanceOfUser' : IDL.Func([IDL.Principal, Token], [IDL.Nat], []),
    'commitDeposit' : IDL.Func([Token], [IDL.Vec(IDL.Nat8)], []),
    'deposit' : IDL.Func([Token, IDL.Opt(IDL.Nat)], [TokenResult], []),
    'fetchGames' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'setBalance' : IDL.Func([IDL.Principal, Token], [], []),
    'totalBalance' : IDL.Func([Token], [IDL.Nat], []),
    'withdraw' : IDL.Func([Token], [TokenResult], []),
  });
};
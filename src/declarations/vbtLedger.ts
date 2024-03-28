import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Account__1 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface AdvancedSettings {
  'permitted_drift' : Timestamp,
  'burned_tokens' : Balance,
  'transaction_window' : Timestamp,
}
export interface ArchivedTransaction {
  'callback' : QueryArchiveFn,
  'start' : TxIndex,
  'length' : bigint,
}
export type Balance = bigint;
export type Balance__1 = bigint;
export interface Burn {
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface BurnArgs {
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface GetTransactionsRequest { 'start' : TxIndex, 'length' : bigint }
export interface GetTransactionsRequest__1 {
  'start' : TxIndex,
  'length' : bigint,
}
export interface GetTransactionsResponse {
  'first_index' : TxIndex,
  'log_length' : bigint,
  'transactions' : Array<Transaction>,
  'archived_transactions' : Array<ArchivedTransaction>,
}
export type MetaDatum = [string, Value];
export interface Mint {
  'to' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface Mint__1 {
  'to' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export type QueryArchiveFn = ActorMethod<
  [GetTransactionsRequest__1],
  TransactionRange
>;
export type Subaccount = Uint8Array | number[];
export interface SupportedStandard { 'url' : string, 'name' : string }
export type Timestamp = bigint;
export interface TokenInitArgs {
  'fee' : Balance,
  'advanced_settings' : [] | [AdvancedSettings],
  'decimals' : number,
  'minting_account' : [] | [Account],
  'name' : string,
  'initial_balances' : Array<[Account, Balance]>,
  'min_burn_amount' : Balance,
  'max_supply' : Balance,
  'symbol' : string,
}
export interface Transaction {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint__1],
  'timestamp' : Timestamp,
  'index' : TxIndex,
  'transfer' : [] | [Transfer],
}
export interface TransactionRange { 'transactions' : Array<Transaction> }
export interface Transaction__1 {
  'burn' : [] | [Burn],
  'kind' : string,
  'mint' : [] | [Mint__1],
  'timestamp' : Timestamp,
  'index' : TxIndex,
  'transfer' : [] | [Transfer],
}
export interface Transfer {
  'to' : Account,
  'fee' : [] | [Balance],
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [Balance],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
  'amount' : Balance,
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Balance } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Balance } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Balance } };
export type TransferResult = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type TxIndex = bigint;
export type TxIndex__1 = bigint;
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface _SERVICE {
  'burn' : ActorMethod<[BurnArgs], TransferResult>,
  'claim' : ActorMethod<[], Array<TransferResult>>,
  'deposit_cycles' : ActorMethod<[], undefined>,
  'fetchAccounts' : ActorMethod<[], Array<[Principal, bigint]>>,
  'get_transaction' : ActorMethod<[TxIndex__1], [] | [Transaction__1]>,
  'get_transactions' : ActorMethod<
    [GetTransactionsRequest],
    GetTransactionsResponse
  >,
  'icrc1_balance_of' : ActorMethod<[Account__1], Balance__1>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], Balance__1>,
  'icrc1_metadata' : ActorMethod<[], Array<MetaDatum>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account__1]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Balance__1>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'mint' : ActorMethod<[Mint], TransferResult>,
  'resetTokens' : ActorMethod<[], undefined>,
  'startTimer' : ActorMethod<[], undefined>,
  'testClaim' : ActorMethod<[Principal], Array<TransferResult>>,
  'testTransfer' : ActorMethod<[Principal], TransferResult>,
}
export const idlFactory = ({ IDL }: any) => {
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Balance = IDL.Nat;
    const BurnArgs = IDL.Record({
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'from_subaccount' : IDL.Opt(Subaccount),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const TxIndex = IDL.Nat;
    const Timestamp = IDL.Nat64;
    const TransferError = IDL.Variant({
      'GenericError' : IDL.Record({
        'message' : IDL.Text,
        'error_code' : IDL.Nat,
      }),
      'TemporarilyUnavailable' : IDL.Null,
      'BadBurn' : IDL.Record({ 'min_burn_amount' : Balance }),
      'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
      'BadFee' : IDL.Record({ 'expected_fee' : Balance }),
      'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
      'TooOld' : IDL.Null,
      'InsufficientFunds' : IDL.Record({ 'balance' : Balance }),
    });
    const TransferResult = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
    const TxIndex__1 = IDL.Nat;
    const Account = IDL.Record({
      'owner' : IDL.Principal,
      'subaccount' : IDL.Opt(Subaccount),
    });
    const Burn = IDL.Record({
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Mint__1 = IDL.Record({
      'to' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Transfer = IDL.Record({
      'to' : Account,
      'fee' : IDL.Opt(Balance),
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Transaction__1 = IDL.Record({
      'burn' : IDL.Opt(Burn),
      'kind' : IDL.Text,
      'mint' : IDL.Opt(Mint__1),
      'timestamp' : Timestamp,
      'index' : TxIndex,
      'transfer' : IDL.Opt(Transfer),
    });
    const GetTransactionsRequest = IDL.Record({
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const Transaction = IDL.Record({
      'burn' : IDL.Opt(Burn),
      'kind' : IDL.Text,
      'mint' : IDL.Opt(Mint__1),
      'timestamp' : Timestamp,
      'index' : TxIndex,
      'transfer' : IDL.Opt(Transfer),
    });
    const GetTransactionsRequest__1 = IDL.Record({
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const TransactionRange = IDL.Record({
      'transactions' : IDL.Vec(Transaction),
    });
    const QueryArchiveFn = IDL.Func(
        [GetTransactionsRequest__1],
        [TransactionRange],
        ['query'],
      );
    const ArchivedTransaction = IDL.Record({
      'callback' : QueryArchiveFn,
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const GetTransactionsResponse = IDL.Record({
      'first_index' : TxIndex,
      'log_length' : IDL.Nat,
      'transactions' : IDL.Vec(Transaction),
      'archived_transactions' : IDL.Vec(ArchivedTransaction),
    });
    const Account__1 = IDL.Record({
      'owner' : IDL.Principal,
      'subaccount' : IDL.Opt(Subaccount),
    });
    const Balance__1 = IDL.Nat;
    const Value = IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
    });
    const MetaDatum = IDL.Tuple(IDL.Text, Value);
    const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
    const TransferArgs = IDL.Record({
      'to' : Account,
      'fee' : IDL.Opt(Balance),
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'from_subaccount' : IDL.Opt(Subaccount),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Mint = IDL.Record({
      'to' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    return IDL.Service({
      'burn' : IDL.Func([BurnArgs], [TransferResult], []),
      'claim' : IDL.Func([], [IDL.Vec(TransferResult)], []),
      'deposit_cycles' : IDL.Func([], [], []),
      'fetchAccounts' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          [],
        ),
      'get_transaction' : IDL.Func([TxIndex__1], [IDL.Opt(Transaction__1)], []),
      'get_transactions' : IDL.Func(
          [GetTransactionsRequest],
          [GetTransactionsResponse],
          ['query'],
        ),
      'icrc1_balance_of' : IDL.Func([Account__1], [Balance__1], ['query']),
      'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
      'icrc1_fee' : IDL.Func([], [Balance__1], ['query']),
      'icrc1_metadata' : IDL.Func([], [IDL.Vec(MetaDatum)], ['query']),
      'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account__1)], ['query']),
      'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
      'icrc1_supported_standards' : IDL.Func(
          [],
          [IDL.Vec(SupportedStandard)],
          ['query'],
        ),
      'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
      'icrc1_total_supply' : IDL.Func([], [Balance__1], ['query']),
      'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
      'mint' : IDL.Func([Mint], [TransferResult], []),
      'resetTokens' : IDL.Func([], [], []),
      'startTimer' : IDL.Func([], [], []),
      'testClaim' : IDL.Func([IDL.Principal], [IDL.Vec(TransferResult)], []),
      'testTransfer' : IDL.Func([IDL.Principal], [TransferResult], []),
    });
  };

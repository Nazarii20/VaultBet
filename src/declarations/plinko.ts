import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface CreateBetResponsePayload {
  gameId: string;
  multiplierIndex: bigint;
}
export interface GameHistoryModel {
  status: bigint;
  updated_at: bigint;
  created_at: bigint;
  perGameTokenAmount: Token;
  principal_id: string;
  multiplierValue: string;
}
export interface GamePayload {
  gameId: string;
  multiplierValue: string;
}
export interface SubmitBetResponsePayload {
  status: bigint;
  gameId: string;
  multiplierValue: string;
}
export type Token =
  | { YC: bigint }
  | { BOX: bigint }
  | { HOT: bigint }
  | { ICP: bigint }
  | { SOC: bigint }
  | { TRT: bigint }
  | { VBT: bigint }
  | { XTC: bigint }
  | { GHOST: bigint }
  | { CHAT: bigint }
  | { SNS1: bigint }
  | { WICP: bigint }
  | { KINIC: bigint }
  | { CKBTC: bigint }
  | { CKETH: bigint };
export interface _SERVICE {
  createBet: ActorMethod<
    [string, bigint, bigint],
    Array<CreateBetResponsePayload>
  >;
  getAllBets: ActorMethod<[], Array<[string, Array<GamePayload>]>>;
  getAllBetsForLoginUser: ActorMethod<[], Array<[Principal, Array<string>]>>;
  getAllBetsSize: ActorMethod<[], bigint>;
  getAllGameIds: ActorMethod<[], Array<[string, GameHistoryModel]>>;
  getAllGameIdsSize: ActorMethod<[], bigint>;
  getBet: ActorMethod<[string], [] | [Array<GamePayload>]>;
  getFailedGameIdStack: ActorMethod<[], Array<[string, string]>>;
  getFailedGameIdStackSize: ActorMethod<[], bigint>;
  getVerificationStack: ActorMethod<[], Array<[string, string]>>;
  getVerificationStackSize: ActorMethod<[], bigint>;
  getVerifiedGameIdStack: ActorMethod<[], Array<[string, string]>>;
  getVerifiedGameIdStackSize: ActorMethod<[], bigint>;
  greet: ActorMethod<[string], string>;
  submitBet: ActorMethod<[Array<GamePayload>], Array<SubmitBetResponsePayload>>;
}

export const idlFactory = ({ IDL }: any) => {
  const CreateBetResponsePayload = IDL.Record({
    gameId: IDL.Text,
    multiplierIndex: IDL.Int,
  });
  const GamePayload = IDL.Record({
    gameId: IDL.Text,
    multiplierValue: IDL.Text,
  });
  const Token = IDL.Variant({
    YC: IDL.Nat,
    BOX: IDL.Nat,
    HOT: IDL.Nat,
    ICP: IDL.Nat,
    SOC: IDL.Nat,
    TRT: IDL.Nat,
    VBT: IDL.Nat,
    XTC: IDL.Nat,
    GHOST: IDL.Nat,
    CHAT: IDL.Nat,
    SNS1: IDL.Nat,
    WICP: IDL.Nat,
    KINIC: IDL.Nat,
    CKBTC: IDL.Nat,
    CKETH: IDL.Nat,
  });
  const GameHistoryModel = IDL.Record({
    status: IDL.Nat,
    updated_at: IDL.Int,
    created_at: IDL.Int,
    perGameTokenAmount: Token,
    principal_id: IDL.Text,
    multiplierValue: IDL.Text,
  });
  const SubmitBetResponsePayload = IDL.Record({
    status: IDL.Nat,
    gameId: IDL.Text,
    multiplierValue: IDL.Text,
  });
  return IDL.Service({
    createBet: IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Nat],
      [IDL.Vec(CreateBetResponsePayload)],
      []
    ),
    getAllBets: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(GamePayload)))],
      ["query"]
    ),
    getAllBetsForLoginUser: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Text)))],
      ["query"]
    ),
    getAllBetsSize: IDL.Func([], [IDL.Nat], ["query"]),
    getAllGameIds: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, GameHistoryModel))],
      ["query"]
    ),
    getAllGameIdsSize: IDL.Func([], [IDL.Nat], ["query"]),
    getBet: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(GamePayload))], ["query"]),
    getFailedGameIdStack: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    getFailedGameIdStackSize: IDL.Func([], [IDL.Nat], ["query"]),
    getVerificationStack: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    getVerificationStackSize: IDL.Func([], [IDL.Nat], ["query"]),
    getVerifiedGameIdStack: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    getVerifiedGameIdStackSize: IDL.Func([], [IDL.Nat], ["query"]),
    greet: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
    submitBet: IDL.Func(
      [IDL.Vec(GamePayload)],
      [IDL.Vec(SubmitBetResponsePayload)],
      []
    ),
  });
};
export const init = ({ IDL }: any) => {
  return [];
};

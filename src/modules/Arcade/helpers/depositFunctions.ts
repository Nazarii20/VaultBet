/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserBalances } from "@utils/userBalance";
import { unwrapResult } from '@utils/resultHelper';
import { Principal } from '@dfinity/principal';
import { decimals } from "@utils/validationHelper";


export const depositICRC = async (
    amount: number, 
    bankActor: any, 
    currency: string,
    ledgerActor: any = null, 
    principal: string = "", 
    bankCanisterId: string = "",
) => {

    console.log("params", "amount", amount, "bankActor", bankActor,"currency", currency, "ledgerActor", ledgerActor, "principal", principal, "bankCanisterId", bankCanisterId);
    try {
      const e8sAmount = BigInt(Math.floor(amount * decimals));
      const currentBalance = await ledgerActor.icrc1_balance_of(
        {owner: Principal.fromText(principal), subaccount: []}
      );
      const fees: Record<string, bigint[]> = {
        "CKBTC": [BigInt(10)],
        "VBT": [BigInt(0)]
      };
      if ((Number(currentBalance) / decimals) >= amount) {
        const commitMemo = await bankActor.commitDeposit({[currency]: e8sAmount});
        console.log("commitMemo", commitMemo);
        const transferResponse = await ledgerActor.icrc1_transfer({
          to: {
            owner: Principal.fromText(bankCanisterId),
            subaccount: []
          },
          amount: e8sAmount,
          fee: fees[currency],
          memo: [commitMemo],
          from_subaccount: [],
          created_at_time: []
        });      
        const blockheight = await unwrapResult(transferResponse);
        console.log("blockheight: ", blockheight, "token: ", {[currency]: e8sAmount} );
        const depositResponse = await bankActor.deposit({[currency]: e8sAmount}, [blockheight]);
        console.log("deposit response", depositResponse);
        await unwrapResult(depositResponse['ICRC']);
      }
    } catch (error) {
      console.log("error",error);
      return false
    }
    return true
  };

export const depositDIP20 = async (
    amount: number,
    bankActor: any,
    currency: string,
    ledgerActor: any = null, 
    principal: string = "", 
    bankCanisterId: string = "",
    DIP20Ledger: any = null,
) => {
    try {
      const e8sAmount = BigInt(amount * decimals);
      const currentBalance = await getUserBalances(ledgerActor, principal);
      if (Number(currentBalance) >= Number(e8sAmount)) {
        const transferResponse = await ledgerActor.icrc1_transfer({
          to: {
            owner: Principal.fromText('utozz-siaaa-aaaam-qaaxq-cai'),
            subaccount: []
          },
          amount: BigInt(e8sAmount),
          fee: [BigInt(10_000)],
          memo: [[Number(0)]],
          from_subaccount: [],
          created_at_time: []
        });
        const blockheight = await unwrapResult(transferResponse);
        const mintResponse = await DIP20Ledger.mint([], blockheight);
        await unwrapResult(mintResponse);
        const approvalResponse = await DIP20Ledger.approve(Principal.fromText(bankCanisterId), e8sAmount);
        await unwrapResult(approvalResponse);
        console.log('approvalResponse', approvalResponse);
        const allowanceResponse = await DIP20Ledger.allowance(Principal.fromText(principal), Principal.fromText(bankCanisterId));
        console.log('allowance', allowanceResponse);
        const bal = await DIP20Ledger.balanceOf(Principal.fromText(principal));
        console.log('balance', bal);
        console.log("amount", e8sAmount)
        const sendAmount = BigInt(Number(e8sAmount) - 50_000);
        console.log("sendAmount", sendAmount)
        // const arcadeDepositResponse = await wcipLedger.transferFrom(Principal.fromText(principal), Principal.fromText(crashCanisterId), sendAmount);
        // console.log("arcadeDepositResponse", arcadeDepositResponse)
        // await unwrapResult(arcadeDepositResponse);
        const arcadeDepositResponse = await bankActor.deposit({[currency]: e8sAmount}, []);
        console.log("arcadeDepositResponse", arcadeDepositResponse)
        await unwrapResult(arcadeDepositResponse['DIP20']);
      }
    } catch (error) {
      console.log("error", error);
      return false
    }
    return true
  };
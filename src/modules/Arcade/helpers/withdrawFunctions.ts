/* eslint-disable @typescript-eslint/no-explicit-any */
import { unwrapResult } from '@utils/resultHelper';
import { Principal } from '@dfinity/principal';
import { decimals } from "@utils/validationHelper";
import { AccountIdentifier } from "@dfinity/nns";

export const withdrawICRC = async (
    amount: number, 
    bankActor: any, 
    currency: string
) => {
    let withdrawResponse = false;
    try {
      const e8sAmount = BigInt(Math.floor(amount * decimals));
      const currentBalance = await bankActor.getBalance({[currency]: e8sAmount});
      if (currentBalance >= e8sAmount) {
        const withdrawResponse = await bankActor.withdraw({[currency]: e8sAmount});
        console.log("withdrawResponse", withdrawResponse)
        await unwrapResult(withdrawResponse['ICRC']);
      }
      withdrawResponse = true
    } catch (error) {
      console.log(error);
      return false
    }

    return withdrawResponse;
  };



export const withdrawDIP20 = async (
    amount: number, 
    bankActor: any, 
    currency: string,
    ledgerActor: any = null, 
    principal: string = "", 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bankCanisterId: string = "",
    DIP20Ledger: any = null
) => {
    let withdrawResponse = false;
    console.log("here withdrawDIP20", amount, bankActor, currency, ledgerActor, principal)
    try {
      const e8sAmount = BigInt(amount * decimals);
      const currentBalance = await bankActor.getBalance({[currency]: e8sAmount});
      if (currentBalance >= e8sAmount) {
        const crashWithdrawResponse = await bankActor.withdraw({[currency]: e8sAmount});
        console.log("crashWithdrawResponse", crashWithdrawResponse)
        await unwrapResult(crashWithdrawResponse['DIP20']);

        const id = AccountIdentifier.fromPrincipal({ principal: Principal.fromText(principal) });

        const wicpWithdrawResponse = await DIP20Ledger.withdraw(e8sAmount, id.toHex())
        await unwrapResult(wicpWithdrawResponse);

      }
      withdrawResponse = true
    } catch (error) {
      console.log(error);
      return false
    }

    return withdrawResponse;
  };
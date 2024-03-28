import { AccountIdentifier, SubAccount } from '@dfinity/nns';
import { Principal } from '@dfinity/principal';


export async function getUserBalances(ledgerActor: any, principal: string) {
    try {
        console.log("principal", principal);
        const userIdentifier = AccountIdentifier.fromPrincipal({
            principal: Principal.fromText(principal),
            subAccount: SubAccount.ZERO
        }).toNumbers();

        const userRawIcpBalance = await ledgerActor?.account_balance({ account: userIdentifier });
        console.log("userRawIcpBalance", userRawIcpBalance);

        return userRawIcpBalance.e8s;
    } catch (error) {
        console.log("get user balances error: ", error);
        return "";
    }
}
import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/ckbtcLedger';

export default function useCKBTCLedgerActor() {
	const [ledgerActor] = useCanister('ckbtcLedger') as unknown as [_SERVICE];
	return ledgerActor;
}

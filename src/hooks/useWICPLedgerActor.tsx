import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/wicpLedger';

export default function useWICPLedgerActor() {
	const [ledgerActor] = useCanister('wicpLedger') as unknown as [_SERVICE];
	return ledgerActor;
}

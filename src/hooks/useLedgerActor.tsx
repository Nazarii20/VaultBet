import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/ledger';

export default function useLedgerActor() {
	const [ledgerActor] = useCanister('ledger') as unknown as [_SERVICE];
	return ledgerActor;
}

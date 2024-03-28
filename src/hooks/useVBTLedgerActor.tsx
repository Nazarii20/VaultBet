import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/vbtLedger';

export default function useVBTLedgerActor() {
	const [ledgerActor] = useCanister('vbtLedger') as unknown as [_SERVICE];
	return ledgerActor;
}

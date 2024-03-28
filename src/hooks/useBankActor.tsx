import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/bank';

export function useBankActor() {
	const [ledgerActor] = useCanister('bank') as unknown as [_SERVICE];
	return ledgerActor;
}

import { _SERVICE, idlFactory } from '@declarations/crash';
import { IConnector } from '@connect2ic/core';
import { Actor, HttpAgent } from '@dfinity/agent';

// export default function useCrashActor() {
// 	const [crashActor] = useCanister('crash') as unknown as [_SERVICE];
// 	return crashActor;
// }

export async function useCrashActor(activeProvider: IConnector | undefined, crashPrincipal: string) {
	const actorResult = await activeProvider?.createActor<_SERVICE>(crashPrincipal, idlFactory, { host: 'https://ic0.app' });
	return actorResult!._unsafeUnwrap();
}

export function useAnonymousCrashActor(crashPrincipal: string) {
	const agent = new HttpAgent({ host: 'https://ic0.app' });
	return Actor.createActor<_SERVICE>(idlFactory, { canisterId: crashPrincipal, agent });
}

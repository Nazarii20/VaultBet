import { _SERVICE, idlFactory } from '@declarations/busRide';
import { IConnector } from '@connect2ic/core';
import { Actor, HttpAgent } from '@dfinity/agent';
import useGlobal from './useGlobal';

export async function useBusRideActor(activeProvider: IConnector | undefined, busRidePrincipal: string) {
	const actorResult = await activeProvider?.createActor<_SERVICE>(busRidePrincipal, idlFactory, { host: 'https://ic0.app' });
	return actorResult!._unsafeUnwrap();
}

export function useAnonymousBusRideActor(busRidePrincipal: string) {
	const { host } = useGlobal();
	console.log("host", host);
	const agent = new HttpAgent({ host });
	agent.fetchRootKey();

	return Actor.createActor<_SERVICE>(idlFactory, { canisterId: busRidePrincipal, agent });
}

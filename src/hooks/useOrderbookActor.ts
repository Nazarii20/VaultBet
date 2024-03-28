import { IConnector } from '@connect2ic/core';
import { useCanister, useConnect } from '@connect2ic/react';
import { _SERVICE, idlFactory as orderbookIdl } from '@declarations/orderbook';
import { Actor, HttpAgent } from '@dfinity/agent';

export const host = process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:5173/';

export async function useOrderbookActor(activeProvider: IConnector | undefined, orderbookPrincipal: string) {
	const actorResult = await activeProvider?.createActor<_SERVICE>(orderbookPrincipal, orderbookIdl, { host: host });
	return actorResult!._unsafeUnwrap();
}

export function useAnonymousOrderbookActor(orderbookPrincipal: string) {
	const isProd = process.env.NODE_ENV === 'production';
	let host = isProd ? 'https://ic0.app' : 'http://localhost:5173/';

	const agent = new HttpAgent({ host });
	// if (!isProd) {
	// TODO: // disable this when going live
	agent.fetchRootKey();
	// }

	return Actor.createActor<_SERVICE>(orderbookIdl, { canisterId: orderbookPrincipal, agent });
}

import { IConnector } from '@connect2ic/core';
import { _SERVICE, idlFactory } from '@declarations/lottery';
import { Actor, HttpAgent } from '@dfinity/agent';

export const host = 'https://icp0.io';

export default async function useLotteryActor(activeProvider: IConnector | undefined, canisterId: string) {
	let actorResult = await activeProvider?.createActor<_SERVICE>(canisterId, idlFactory, { host });

	return actorResult?.isOk() ? actorResult.value : useAnonymousLotteryActor(canisterId);
}

export function useAnonymousLotteryActor(canisterId: string) {
	const agent = new HttpAgent({ host });
	// if (!isProd) {
	// TODO: // disable this when going live
	agent.fetchRootKey();
	// }
	let actorResult = Actor.createActor<_SERVICE>(idlFactory, { canisterId: canisterId, agent });
	

	return actorResult;
}

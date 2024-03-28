import { useCanister } from '@connect2ic/react';
import { _SERVICE } from '@declarations/game';

export default function useGameActor() {
	const [gameActor] = useCanister('game') as unknown as [_SERVICE];
	return gameActor;
}

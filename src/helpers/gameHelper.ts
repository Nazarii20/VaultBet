import { GameStatus } from '@declarations/game';

export function gameStatusToString(gameStatus: GameStatus) {
	if ('Ongoing' in gameStatus) {
		return 'Ongoing';
	}
	if ('Finished' in gameStatus) {
		return 'Finished';
	}
	if ('Postponed' in gameStatus) {
		return 'Postponed';
	}
	if ('Scheduled' in gameStatus) {
		return 'Scheduled';
	}
	return 'Unknown';
}

// export function apiGameStatusToString(apiGameStatus: ApiGameStatus) {
// 	if ('Abandoned' in apiGameStatus) {
// 		return 'Abandoned';
// 	}
// 	if ('TechnicalLoss' in apiGameStatus) {
// 		return 'Technical loss';
// 	}
// 	if ('ExtraTime' in apiGameStatus) {
// 		return 'Extra time';
// 	}
// 	if ('WalkOver' in apiGameStatus) {
// 		return 'Walk over';
// 	}
// 	if ('Interrupted' in apiGameStatus) {
// 		return 'Interrupted';
// 	}
// 	if ('TimeToBeDefined' in apiGameStatus) {
// 		return 'Time to be defined';
// 	}
// 	if ('Finished' in apiGameStatus) {
// 		return 'Finished';
// 	}
// 	if ('Suspended' in apiGameStatus) {
// 		return 'Suspended';
// 	}
// 	if ('SecondHalf' in apiGameStatus) {
// 		return 'Second half';
// 	}
// 	if ('FinishedExtraTime' in apiGameStatus) {
// 		return 'Finished extra time';
// 	}
// 	if ('Postponed' in apiGameStatus) {
// 		return 'Postponed';
// 	}
// 	if ('FirstHalf' in apiGameStatus) {
// 		return 'First half';
// 	}
// 	if ('Penalties' in apiGameStatus) {
// 		return 'Penalties';
// 	}
// 	if ('Cancelled' in apiGameStatus) {
// 		return 'Cancelled';
// 	}
// 	if ('InProgress' in apiGameStatus) {
// 		return 'In progress';
// 	}
// 	if ('BreakTime' in apiGameStatus) {
// 		return 'Break time';
// 	}
// 	if ('HalfTime' in apiGameStatus) {
// 		return 'Half time';
// 	}
// 	if ('NotStarted' in apiGameStatus) {
// 		return 'Not started';
// 	}
// 	if ('FinishedPenalties' in apiGameStatus) {
// 		return 'Finished penalties';
// 	}
// 	return 'Unknown';
// }

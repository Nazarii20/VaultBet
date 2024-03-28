export interface Fixture {
	fixture: {
		id: number;
		sport: string;
		timezone: string;
		date: string;
		timestamp: number;
		venue: { id: number; name: string; city: string };
		status: { long: string; short: string; elapsed: number };
	};

	league: {
		id: number;
		name: string;
		country: string;
		logo: string;
		flag: string;
		season: number;
		round: string;
	};
	teams: { home: { id: number; name: string; logo: string; winner?: any }; away: { id: number; name: string; logo: string; winner?: any } };
}

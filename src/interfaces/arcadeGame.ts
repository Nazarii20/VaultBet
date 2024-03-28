export interface ArcadeGame {
    id: number;
    name: string;
    description: string;
    logo: string;
}

export interface UserData {
	balance: number;
	principalId: string | undefined;
}
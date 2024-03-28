import React, { PropsWithChildren, createContext, useState } from 'react';
import { Fixture } from 'src/interfaces/fixture';
import { ArcadeGame } from 'src/interfaces/arcadeGame';
import fixtures from 'src/data/fixtures.json';
import arcadeGames from 'src/config/arcadeGames.json'
import { TabType } from '@components/HomeTabs/HomeTabs';

type NotationType = 'decimal' | 'fractional';

interface IGlobalContext {
	fixtures: Fixture[];
	notationType: NotationType;
	setNotationType: (type: 'decimal' | 'fractional') => void;
	pageTitle: string | undefined;
	setPageTitle: (title: string | undefined) => void;
	isVerified: boolean;
	verify: () => void;
	host: string;
	arcadeGames: ArcadeGame[];
	isNewData: boolean;
	setIsNewData: (value: boolean) => void;
	tab: TabType;
	setTab: (value: TabType) => void;
}

const isProd = process.env.NODE_ENV === 'production';
const isCrash = process.env.TEST_ENV === 'crash';

const host = isProd || isCrash ? 'https://ic0.app' : 'http://localhost:5173/';

export const GlobalContext = createContext<IGlobalContext>({
	fixtures: [],
	notationType: 'decimal',
	setNotationType: () => {},
	pageTitle: '',
	setPageTitle: () => {},
	isVerified: false,
	verify: () => {},
	host: host,
	arcadeGames: [],
	isNewData: false,
	setIsNewData: () => {},
	tab: 'home',
	setTab: () => {},
});

export default function GlobalContextProvider({ children }: PropsWithChildren) {
	const [state, setState] = useState<IGlobalContext>({
		fixtures,
		notationType: (localStorage.getItem('notationType') as NotationType) || 'decimal',
		setNotationType,
		pageTitle: undefined,
		setPageTitle,
		isVerified: Boolean(localStorage.getItem('isVerified')),
		verify,
		host,
		arcadeGames,
		isNewData: false,
		setIsNewData,
		tab: 'home',
		setTab,
	});

	function setIsNewData(isNewData: boolean) {
		setState(prevState => ({ ...prevState, isNewData }));
	}

	function setNotationType(notationType: 'decimal' | 'fractional') {
		localStorage.setItem('notationType', notationType);
		setState(prevState => ({ ...prevState, notationType }));
	}

	function setPageTitle(pageTitle: string | undefined) {
		setState(prevState => ({ ...prevState, pageTitle }));
	}

	function verify() {
		localStorage.setItem('isVerified', 'true');
		setState(prevState => ({ ...prevState, isVerified: true }));
	}

	function setTab(tab: TabType) {
    setState((prevState) => ({ ...prevState, tab }));
  }

	return <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>;
}

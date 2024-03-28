import Frame from '@components/Frame/Frame';
import Router from '@components/Router/Router';
import { createClient } from '@connect2ic/core';
import {
	InfinityWallet,
	NFID,
	PlugWallet,
	StoicWallet,
} from '@connect2ic/core/providers';
import { Connect2ICProvider } from '@connect2ic/react';
import mainnetCanisterIds, { mainnetCanisterIdsAsArray } from '@misc/mainnetCanisterIds';
import localCanisterIds, { localCanisterIdsAsArray } from '@misc/localCanisterIds';
import { theme } from '@misc/theme';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { idlFactory as gameIdl } from '@declarations/game';
import { idlFactory as ledgerIdl } from '@declarations/ledger';
import { idlFactory as wicpLedgerIdl } from '@declarations/wicpLedger';
import { idlFactory as ckbtcLedgerIdl } from '@declarations/ckbtcLedger';
import { idlFactory as vbtLedgerIdl } from '@declarations/vbtLedger';
import { idlFactory as bankIdl } from '@declarations/bank';
import { idlFactory as plinkoIdl } from "@declarations/plinko";
import GlobalContextProvider from './context/GlobalContext';
import { lotteryCanisterIdsAsArray } from '@misc/lotteryCanisterIds';
import ArcadeContextProvider from "@context/ArcadeContext";
import { Provider }  from '@funded-labs/plug-inpage-provider';

// TODO: RESET THIS
const isProd = process.env.NODE_ENV === "production";

const isCrash = process.env.TEST_ENV === "crash";

const host = isProd || isCrash ? "https://icp0.io" : "http://localhost:5173/";
const ledgerCanisterId =
	isProd || isCrash
		? mainnetCanisterIds.ledgerCanisterId
		: localCanisterIds.ledgerCanisterId;

		const WC_PROJECT_ID = '8c6ad5dd65b7e0e50914bfc6434f31b4'

const ua = navigator.userAgent.toLowerCase();
const isAndroid = ua.indexOf('android') > -1;
const isApple = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;

const isMobile = isAndroid || isApple;

if (!window.ic?.plug && isMobile) {
	Provider.exposeProviderWithWalletConnect({
		window,
		wcProjectId: WC_PROJECT_ID,
		debug: !isProd
	});
}

export const plug = window.ic?.plug;

export const client = createClient({
	globalProviderConfig: {
		host,
		whitelist: isProd || isCrash ? [...mainnetCanisterIdsAsArray, ...lotteryCanisterIdsAsArray, 'utozz-siaaa-aaaam-qaaxq-cai', 'mxzaz-hqaaa-aaaar-qaada-cai'] : localCanisterIdsAsArray,
		appName: 'VaultBet',
		dev: !isProd
	},
	canisters: {
		['game']: {
			canisterId: isProd || isCrash ? mainnetCanisterIds.gameCanisterId : localCanisterIds.gameCanisterId,
			idlFactory: gameIdl
		},
		['bank']: {
			canisterId: mainnetCanisterIds.bankCanisterId,
			idlFactory: bankIdl,
		},
		['ledger']: {
			canisterId: ledgerCanisterId,
			idlFactory: ledgerIdl
		},
		['wicpLedger']: {
			canisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
			idlFactory: wicpLedgerIdl
		},
		['ckbtcLedger']: {
			canisterId: 'mxzaz-hqaaa-aaaar-qaada-cai',
			idlFactory: ckbtcLedgerIdl
		},
		['vbtLedger']: {
			canisterId: 'vtkgs-raaaa-aaaak-afcua-cai',
			idlFactory: vbtLedgerIdl
		},
		['plinko']: {
			canisterId: mainnetCanisterIds.plinkoCanisterId,
			idlFactory: plinkoIdl,
		}
	},
	providers: [new PlugWallet(), new StoicWallet(), new NFID(), new InfinityWallet()]
});

export default function App() {
	return (
		<Connect2ICProvider client={client}>
				<ThemeProvider theme={theme}>
					<GlobalContextProvider>
						<ArcadeContextProvider>
							<BrowserRouter>
								<Frame>
									<Router />
								</Frame>
							</BrowserRouter>
						</ArcadeContextProvider>
					</GlobalContextProvider>
				</ThemeProvider>
		</Connect2ICProvider>
	);
}

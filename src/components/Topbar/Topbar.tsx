import { AppBar, Container, Toolbar, Box, Menu, MenuItem, Button, Divider, CircularProgress, Typography, useMediaQuery, IconButton, ButtonGroup, ListItemIcon } from '@mui/material';
import React, { useEffect, useState } from 'react';
import logo from '@assets/images/topbar-logo.png';
import settings from '@assets/icons/ic-settings.svg';
import menuRounded from '@assets/icons/ic-menu-rounded.svg';
import ckbtcIcon from '@assets/icons/ic-ckbtc.png';
import icpIcon from '@assets/icons/ic-icp.png';
import vbtIcon from '@assets/icons/ic-vbt.png';
import iconVBT from '@assets/images/ic-vbt.png'
import wallet from '@assets/icons/ic-wallet.svg';
import { useConnect } from '@connect2ic/react';
import { IConnector, InfinityWallet, NFID, PlugWallet, StoicWallet } from '@connect2ic/core/providers';
import { _SERVICE as _LEDGER_SERVICE } from '@declarations/ledger';
import { theme } from '@misc/theme';
import { getUserBalances } from '@utils/userBalance';
import { _SERVICE } from '@declarations/game';
import { Check, MenuRounded, Settings } from '@mui/icons-material';
import useLedgerActor from 'src/hooks/useLedgerActor';
import useGlobal from 'src/hooks/useGlobal';
import useCKBTCLedgerActor from "src/hooks/useCKBTCLedgerActor";
import { decimals } from "@utils/validationHelper";
import { getPrettyDecimals } from '@utils/validationHelper';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import useVBTLedgerActor from 'src/hooks/useVBTLedgerActor';

import { Usergeek } from "usergeek-ic-js"
import { Principal } from '@dfinity/principal';

interface IProps {
	setDrawerOpen: (value: boolean) => void;
}

interface NavbarButtonProps {
	href: string;
	name: string;
}

const NavbarButton = ({ href, name }: NavbarButtonProps) => {
	return (
		<Box sx={{ flexGrow: 1, textAlign: 'center' }}>
			<Button
				component='a'
				href={href}
				sx={{
					textTransform: 'none',
					color: 'inherit',
					fontSize: '1.1rem',
					fontWeight: 'bold',
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.1)'
					},
					'&:active': {
						backgroundColor: 'rgba(255, 255, 255, 0.2)'
					},
					'&:focus': {
						boxShadow: 'none'
					}
				}}>
				{name}
			</Button>
		</Box>
	);
};

export default function Topbar({ setDrawerOpen }: IProps) {
	const [claimButtonState, setClaimButtonState] = useState("idle");
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [settingAnchorEl, setSettingsAnchorEl] = React.useState<null | HTMLElement>(null);
	const [userIcpBalance, setUserIcpBalance] = useState('');
	const [userCkbtcBalance, setUserCkbtcBalance] = useState('');
	const [userVbtBalance, setUserVbtBalance] = useState('');
	const [isLoadingBalances, setIsLoadingBalances] = useState(false);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	const hideOnSmallScreen = useMediaQuery('(max-width:900px)');
	const { notationType, setNotationType, tab } = useGlobal();
	const { activeProvider, connect, disconnect, isInitializing, principal } = useConnect();
	const ledgerActor = useLedgerActor();
	const vbtActor = useVBTLedgerActor();
	const ckbtcLedgerActor = useCKBTCLedgerActor();

	useEffect(() => {
		initialize();
	}, [principal]);



	function handleLoginClick(provider: string) {
		connect(provider);
		setAnchorEl(null);
	}

	async function initialize() {
		try {
			setIsLoadingBalances(true);
			if (principal) {
				let userBalances = await getUserBalances(ledgerActor, principal);
				userBalances = getPrettyDecimals(userBalances);
				setUserIcpBalance(userBalances);
				const userPrincipal = Principal.fromText(principal)
				Usergeek.setPrincipal(userPrincipal)
				Usergeek.trackSession()
				const ckbtcBalance = await ckbtcLedgerActor.icrc1_balance_of(
					{ owner: Principal.fromText(String(principal)), subaccount: [] }
				);
				setUserCkbtcBalance(String((Number(ckbtcBalance) / decimals).toPrecision(2)));
				const vbtBalance = await vbtActor.icrc1_balance_of(
					{ owner: Principal.fromText(String(principal)), subaccount: [] }
				)
				setUserVbtBalance(String((Number(vbtBalance) / decimals).toFixed(2)));
			}

		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingBalances(false);
		}
	}

	function runDisconnect() {
		Usergeek.setPrincipal(undefined);
		disconnect();
	}

	const handleGiftButtonOnClick = async () => {
		try {
			setClaimButtonState("loading");
			const claimVBTResponse = await vbtActor.claim();
			console.log("claimVBTResponse", claimVBTResponse);
			Usergeek.trackEvent("Redeem VBT");

			if (claimVBTResponse.length === 0) {
				alert("No NFTs found with tokens to withdraw");
				throw new Error("No NFTs found with tokens to withdraw");
			} else {
				for (const token of claimVBTResponse) {
					console.log("token", token);
					alert(`VBT Claimed! Please check your wallet and deposit to the Arcade to start playing!`);

				}
			}

			setClaimButtonState("success");
		} catch (error) {
			setClaimButtonState("error");
			console.log(error);
		} finally {
			setTimeout(() => {
				setClaimButtonState("idle");
			}, 2000); // Simulate a 2-second delay
		}
	}

	const ClaimButton = (
		<Box>
			{claimButtonState === "loading" ? (
				<CircularProgress size={24} thickness={6} color="secondary" />
			) : claimButtonState === "success" ? (
				<IconButton
					sx={{ backgroundColor: "#00AA25", color: "white" }}
				>
					<CheckCircleIcon />
				</IconButton>
			) : claimButtonState === "error" ? (
				<IconButton
					sx={{ backgroundColor: "#C00000", color: "white" }}
				>
					<ErrorIcon />
				</IconButton>
			) : (

				
				<button style={{
					background: 'none',
					border: 'none',
					cursor: 'pointer',
				}}
				onClick={() => handleGiftButtonOnClick()}>
					<img style={{ width: '50px', height: '38px' }} src={iconVBT} />
				</button>

				// <RedeemOutlinedIcon onClick={() => { handleGiftButtonOnClick() }} fontSize="large" sx={{
				// 	color: "thirdColor", // You can change the color
				// 	borderRadius: "8px",
				// 	"&:hover": {
				// 		color: "#800080", // You can change the hover color
				// 	},
				// }} />
			)}
		</Box>
	)

	function renderSettingsMenu(activeProvider: IConnector | undefined) {
		return (
			<Menu anchorEl={settingAnchorEl} open={Boolean(settingAnchorEl)} onClose={() => setSettingsAnchorEl(null)}>
				<MenuItem dense disabled>
					Notation type
				</MenuItem>
				<Divider />
				<MenuItem dense onClick={() => notationType != 'decimal' && setNotationType('decimal')}>
					<ListItemIcon>{notationType === 'decimal' ? <Check /> : <></>}</ListItemIcon>
					Decimal (1.25)
				</MenuItem>
				<MenuItem dense onClick={() => notationType != 'fractional' && setNotationType('fractional')}>
					<ListItemIcon>{notationType === 'fractional' ? <Check /> : <></>}</ListItemIcon>
					Fractional (1/4)
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => runDisconnect()}>
					<img src={activeProvider?.meta.icon.light} height={20} />
					<Box sx={{ marginLeft: 1 }}>Logout</Box>
				</MenuItem>
			</Menu>
		);
	}

	return (
		<AppBar position='static' elevation={0} sx={{ bgcolor: theme.palette.thirdColor.main }}>
			<Container maxWidth={false}>
				<Toolbar disableGutters>
					<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
						<IconButton onClick={() => setDrawerOpen(true)} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
							<img src={menuRounded} />
						</IconButton>
						<Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'left' }}>
							<a href='/'>
								<img style={{ padding: 2 }} src={logo} height={40} width={130} />{' '}
							</a>
						</Box>
						{/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
							<NavbarButton href="/games" name="Games" />
							<NavbarButton href="/arcade" name="Arcade" />
						</Box> */}
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							{activeProvider ? (
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									{!isSmallScreen && !isLoadingBalances && userIcpBalance && (
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
												textAlign: 'end',
												paddingRight: 2
											}}>
											<Box style={{ display: 'flex', gap: '16px' }}>
												<Typography variant='caption'>{userIcpBalance ? (
													<div style={{ display: 'flex', alignItems: 'center' }}>
														{userIcpBalance}
														<img src={icpIcon} style={{ marginLeft: '12px', marginRight: '4px', width: '24px' }} />
														ICP
													</div>
													) : ''} </Typography>
												<span style={{ width: '1px', height: '24px', background: '#2E323A' }}></span>
												<Typography variant='caption'>{userCkbtcBalance ? (
													<div style={{ display: 'flex', alignItems: 'center' }}>
														{userCkbtcBalance}
														<img src={ckbtcIcon} style={{ marginLeft: '12px', marginRight: '4px', width: '24px' }} />
														ckBTC
													</div>
												) : ''} </Typography>
												<span style={{ width: '1px', height: '24px', background: '#2E323A' }}></span>
												<Typography variant='caption'>{userVbtBalance ? (
													<div style={{ display: 'flex', alignItems: 'center' }}>
													{userVbtBalance}
													<img src={vbtIcon} style={{ marginLeft: '12px', marginRight: '4px', width: '24px' }} />
													VBT
												</div>
												) : ''} </Typography>
											</Box>
										</Box>
									)}
									<IconButton sx={{ ml: 1 }} onClick={e => setSettingsAnchorEl(e.currentTarget)}>
										<img src={settings} />
									</IconButton>
									{renderSettingsMenu(activeProvider)}
									<Box>{ClaimButton}</Box>
								</Box>
							) : (
								<Button disabled={isInitializing} color='inherit' onClick={e => setAnchorEl(e.currentTarget)}>
									{isInitializing ? <CircularProgress color='inherit' size={24} /> : (
										<span style={{ display: 'flex', gap: '8px' }}>
											<img src={wallet} />
											{hideOnSmallScreen ? null : (
												<Typography component="span">Connect Wallet</Typography>
											)}
										</span>
									)}
								</Button>
							)}

							<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
								<MenuItem onClick={() => handleLoginClick('plug')}>
									<img src={new PlugWallet().meta.icon.light} height={20} width={20} />
									<Box sx={{ marginLeft: 2 }}>PLUG</Box>
								</MenuItem>
								<MenuItem onClick={() => handleLoginClick('stoic')}>
									<img src={new StoicWallet().meta.icon.light} height={20} width={20} />
									<Box sx={{ marginLeft: 2 }}>STOIC</Box>
								</MenuItem>
								{/* <MenuItem onClick={() => handleLoginClick('nfid')}>
									<img src={new NFID().meta.icon.light} height={20} width={20} />
									<Box sx={{ marginLeft: 2 }}>NFID</Box>
								</MenuItem> */}
								<MenuItem onClick={() => handleLoginClick('infinity')}>
									<img src={new InfinityWallet().meta.icon.light} height={20} width={20} />
									<Box sx={{ marginLeft: 2 }}>Bitfinity</Box>
								</MenuItem>
							</Menu>
						</Box>
					</Box>
				</Toolbar>
			</Container>
			<Divider />
		</AppBar>
	);
}

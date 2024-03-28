import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import logo from '@assets/images/topbar-logo.png';
import useGlobal from 'src/hooks/useGlobal';
import Terms from '@modules/Terms/Terms';
import checkBoxIconDisabled from '@assets/icons/ic-checkbox-disabled.svg';
import checkBoxIconActive from '@assets/icons/ic-checkbox-active.svg';

export default function Verification() {
	const { verify } = useGlobal();
	const [age, setAge] = useState(false);
	const [terms, setTerms] = useState(false);
	const isSmallScreen = useMediaQuery('(max-width:900px)');
	const isSmallScreenHeight = useMediaQuery('(max-height:800px)');

	const PageStyle = {
		paddingTop: '32px',
		height: '100vh',
		// background: 'linear-gradient(180deg, #17133C 0%, #101111 52.6%, #101111 100%), #FFF',
		background: '#1A1B1E',
	}

	const PaperStyle = {
		paddingRight: isSmallScreen ? '32px' : '46px',
		paddingBlock: '24px',
		borderTop: '1px solid #2E323A',
		borderBottom: '1px solid #2E323A',
		background: 'rgba(26, 26, 29, 0.80)',
	}

	const ButtonAccept = {
		alignSelf: isSmallScreen ? 'center' : 'flex-end',
		paddingBlock: '24px',
		paddingInline: '48px',
		textTransform: 'none',
		borderRadius: '16px',
		width: '100%',
    maxWidth: isSmallScreen ? '100%' : '250px',
		fontFamily: 'Poppins',
		fontSize: '18px',
		fontWeight: '500',
		lineHeight: '22px',
	}

	const ButtonAcceptDisabled = {
		opacity: '0.4',
		background: 'rgba(26, 26, 29, 0.80)',
		color: '#FFF',
	}

	const ButtonAcceptActive = {
		background: '#66E094',
		color: '#000',
	}

	type CustomCheckboxType = {
		checked: boolean;
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		label: string;
	}

	const CustomCheckbox = ({ checked, onChange, label }: CustomCheckboxType) => {
		return (
			<FormControlLabel
				control={
					<Checkbox
						checked={checked}
						onChange={onChange}
						icon={<img src={checkBoxIconDisabled} alt="Unchecked Icon" />}
						checkedIcon={<img src={checkBoxIconActive} alt="Checked Icon" />}
					/>
				}
				label={label}
			/>
		);
	};

	return (
		<Box sx={PageStyle}>
			<Box style={{ textAlign: 'center', marginBottom: '15px' }}>
				<img src={logo} alt="VauletBet logo" width={isSmallScreen ? '130px' : 'initial' } />
			</Box>
			<Stack spacing={2}>
				<Typography variant='h4' sx={{ paddingInline: isSmallScreen ? '32px' : '46px', }}>Terms and Conditions</Typography>
				<Typography variant='h6' sx={{ paddingInline: isSmallScreen ? '32px' : '46px', }}>Your Agreement</Typography>
				<Paper sx={PaperStyle}>
					<Stack direction={'column'}>
						<Box sx={{ height: isSmallScreenHeight ? 200 : 360, overflowY: 'scroll', background: 'transparent' }} className="terms-box">
							<Terms />
						</Box>
					</Stack>
				</Paper>
				<Box sx={{ display: 'flex', flexDirection: 'column', paddingInline: isSmallScreen ? '32px' : '46px', gap: isSmallScreen ? '20px' : '0' }}>
					<CustomCheckbox
						checked={terms}
						onChange={(e) => setTerms(e.target.checked)}
						label='I confirm that I have read and accept the terms and conditions and privacy policy.'
					/>

					<CustomCheckbox
						checked={age}
						onChange={(e) => setAge(e.target.checked)}
						label='I am over 18 years of age'
					/>
					<Button 
						disabled={!age || !terms}
						sx={[
							ButtonAccept,
							!age || !terms ? ButtonAcceptDisabled : ButtonAcceptActive,
							{ ':hover': { backgroundColor: '#53ff94' }},
						]}
						onClick={verify}
					>
						Accept
					</Button>
				</Box>
			</Stack>
		</Box>
	);
}

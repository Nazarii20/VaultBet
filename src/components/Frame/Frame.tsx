import DrawerMenu from '@components/DrawerMenu/DrawerMenu';
import Topbar from '@components/Topbar/Topbar';
import Verification from '@modules/Verification/Verification';
import { Box, Container, Typography } from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
import useGlobal from 'src/hooks/useGlobal';

export default function Frame({ children }: PropsWithChildren) {
	const { pageTitle, isVerified } = useGlobal();
	const [drawerOpen, setDrawerOpen] = useState(false);

	if (!isVerified) {
		return <Verification />;
	}

	return (
		<Box sx={{ bgcolor: '#1A1B1E', height: '100%' }}>
			<Topbar setDrawerOpen={setDrawerOpen} />
			{pageTitle ? (
				<Container sx={{ display: 'flex', paddingTop: 4, flexDirection: 'column' }}>
					<Typography gutterBottom variant='h4'>
						{pageTitle}
					</Typography>
					<>{children}</>
				</Container>
			) : (
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					<>{children}</>
				</Box>
			)}
			<DrawerMenu open={drawerOpen} setOpen={setDrawerOpen} />
		</Box>
	);
}
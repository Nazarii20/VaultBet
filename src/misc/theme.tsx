import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		thirdColor: Palette['primary'];
	}
	interface PaletteOptions {
		thirdColor?: PaletteOptions['primary'];
	}
}

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: { main: '#8739F2' },
		secondary: { main: '#a438f5' },
		thirdColor: { main: 'rgba(26, 26, 29, 0.90)' },
	},
	typography: {
		fontFamily: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
	}
});

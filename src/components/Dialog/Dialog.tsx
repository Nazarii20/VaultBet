import { DialogContent, DialogTitle, Dialog as MUIDialog } from '@mui/material';
import React from 'react';

interface IProps {
	title: string;
	content: JSX.Element;
	open: boolean;
	onClose?: () => void;
}

export default function Dialog({ open, onClose, title, content }: IProps) {
	return (
		<MUIDialog fullWidth open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{content}</DialogContent>
		</MUIDialog>
	);
}

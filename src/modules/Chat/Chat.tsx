import React, { useEffect } from 'react';
import useGlobal from 'src/hooks/useGlobal';

export default function Chat() {
	const { setPageTitle } = useGlobal();

	useEffect(() => {
		setPageTitle('Chat');
	}, []);

	return <div>Chat</div>;
}

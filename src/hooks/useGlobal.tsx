import React, { useContext } from 'react';
import { GlobalContext } from 'src/context/GlobalContext';

export default function useGlobal() {
	return useContext(GlobalContext);
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import {Usergeek} from "usergeek-ic-js"

(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

Usergeek.init({
    apiKey: "017B02019AC3E1A01A05A94FC9AE62AA",
	host: "https://ic0.app"
})

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);

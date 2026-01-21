import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Force scroll to top on page load/refresh
if (typeof window !== 'undefined') {
	window.scrollTo(0, 0)
	if (window.history.scrollRestoration) {
		window.history.scrollRestoration = 'manual'
	}
}

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)



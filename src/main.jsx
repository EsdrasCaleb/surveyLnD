import { StrictMode } from 'react'
import './i18n'
import 'antd/dist/reset.css';
import './App.css';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>
);
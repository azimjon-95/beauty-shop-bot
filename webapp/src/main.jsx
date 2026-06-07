import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#1a0a0f');
  tg.setBackgroundColor('#1a0a0f');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

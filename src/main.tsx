import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/main.css';

const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
  document.body.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

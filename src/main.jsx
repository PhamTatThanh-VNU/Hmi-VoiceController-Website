import React from 'react';
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles.css';
import { Provider } from 'react-redux';
import {
    applyMiddleware,
    combineReducers,
    legacy_createStore as createStore,
} from 'redux';
import videosReducer from './redux/reducers/videosReducer';
import { composeWithDevTools } from '@redux-devtools/extension';
import { thunk } from 'redux-thunk';
import videoDetailReducer from './redux/reducers/videoDetails';

import 'react-toastify/dist/ReactToastify.css';

// MUI Theme Provider
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Add Google Fonts - Inter
const inter = document.createElement('link');
inter.rel = 'stylesheet';
inter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(inter);

// Add Roboto font for MUI
const roboto = document.createElement('link');
roboto.rel = 'stylesheet';
roboto.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
document.head.appendChild(roboto);

const reducers = combineReducers({
    videos: videosReducer,
    videoDetail: videoDetailReducer,
});

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
);

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <Provider store={store}>
            <Router>
                <ThemeProvider theme={theme}>
                    <CssBaseline />                    
                        <App />                    
                </ThemeProvider>
            </Router>
        </Provider>
    </StrictMode>
);
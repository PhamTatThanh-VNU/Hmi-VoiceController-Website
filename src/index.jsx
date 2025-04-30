import React from 'react';
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
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
import searchResultReducer from './redux/reducers/searchResultReducer'; 

import 'react-toastify/dist/ReactToastify.css';

const reducers = combineReducers({
  videos: videosReducer,
  videoDetail: videoDetailReducer,
  searchResult: searchResultReducer,
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
          <App />
      </Router>
    </Provider>
  </StrictMode>
);

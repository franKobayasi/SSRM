import React,{Component} from "react";
import {render} from "react-dom";
import {createStore} from 'redux';
import {Provider} from "react-redux";
import {devToolsEnhancer} from 'redux-devtools-extension';
import {initializeFacebook} from "./useFacebook";
import ssrmReducers from './reducers/index.js';
import App from './containers/App';

/** css file improt */
import './css/index.scss';

/** redux store setting */
const initialState={};
const store=createStore(
    ssrmReducers,
    initialState,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    devToolsEnhancer()
);

/** facebook initial for facebook login surport */
initializeFacebook();

render(
  <Provider store={store}>
    <App />
  </Provider>
  ,document.querySelector("#root")
)

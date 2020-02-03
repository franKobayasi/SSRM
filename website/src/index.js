import React,{Component} from "react";
import {render} from "react-dom";
import {createStore} from 'redux';
import {Provider} from "react-redux";
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import ssrmFirebase from './useFirebase';
import ssrmReducers from './reducers/index.js';
import App from './containers/App';

/** css file improt */
import './css/reset.scss';
import './css/memberLogin.css';
import './css/shopLogin.css';
import './css/dashboard.css';

/** redux store setting */
const initialState={};

const store=createStore(
    ssrmReducers,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
}
const rrfProps = {
  firebase:ssrmFirebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  // createFirestoreInstance // <- needed if using firestore
}

render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <App />
        </ReactReduxFirebaseProvider>
    </Provider>
   ,document.querySelector("#root")
)

import { combineReducers } from 'redux';
import fetchReducer from "./fetchReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";
import dashboardReducer from "./dashboardReducer";
import { firebaseReducer } from 'react-redux-firebase';

const ssrmReducers=combineReducers({
    fetch:fetchReducer,
    auth:authReducer,
    shop:shopReducer,
    firebase:firebaseReducer,
    dashboard:dashboardReducer,
})

export default ssrmReducers;
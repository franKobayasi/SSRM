import { combineReducers } from "redux";
import stateReducer from "./stateReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";

const ssrmReducers=combineReducers({
    state:stateReducer,
    auth:authReducer,
    shop:shopReducer,
})

export default ssrmReducers;
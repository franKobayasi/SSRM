import { combineReducers } from "redux";
import stateReducer from "./stateReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";
import shopListReducer from "./shopListReducer";

const ssrmReducers=combineReducers({
    state:stateReducer,
    auth:authReducer,
    shopList:shopListReducer,
    shop:shopReducer,
})

export default ssrmReducers;
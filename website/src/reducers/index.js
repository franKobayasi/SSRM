import { combineReducers } from "redux";
import fetchReducer from "./fetchReducer";
import authReducer from "./authReducer";
import shopReducer from "./shopReducer";
import shopListReducer from "./shopListReducer";

const ssrmReducers=combineReducers({
    fetch:fetchReducer,
    auth:authReducer,
    shopList:shopListReducer,
    shop:shopReducer,
})

export default ssrmReducers;
import { combineReducers } from 'redux';

const initialState={
    isFetch:false,
    auth:{},
};

function authReducer(preState,action){
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'SIGN_IN':
            return Object.assign({},preState,{
                auth:{
                    ...auth,
                    MEMBER_UID:action.MEMBER_UID,
                    isLogin:action.isLogin
                }
            })
            break;
        // case 'SIGN_UP':
        //     return Object.assign({},preState,{

        //     })
        //     break;
        // case 'RESET_PASSWORD':
        //     return Object.assign({},preState,{

        //     })
        //     break;
        // case 'UPDATE_PASSWORD':
        //     return Object.assign({},preState,{

        //     })
        //     break;
        default:
            return preState
            break;
    }
}

function fetchReducer(preState,action){
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'FETCH_POST':
            return Object.assign({},preState,{
                isFetch:true,
            })
            break;
        case 'FETCH_SUCCESS':
            return Object.assign({},preState,{
                isFetch:false,
            })
            break;
        case 'FETCH_FAIL':
            return Object.assign({},preState,{
                isFetch:false,
            })
            break;
        default:
            return preState
            break;
    }
}

const ssrmReducers=combineReducers({
    isFetch:fetchReducer,
    auth:authReducer
})

export default ssrmReducers;
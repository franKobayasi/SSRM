import {ssrmDB} from "../useFirebase";
const initialState={
    user:'undefined',
    id:'undefined',
    title:'undefined',
    state:'uncheck',
}

const shopReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'SHOP_SIGN_IN':
            console.log(action);
            return Object.assign({},preState,{
                user:action.user,
                id:action.id,
                title:action.title,
                state:'signIned',
            })
            break;
        case 'SHOP_SIGN_OUT':
            return Object.assign({},preState,{
                user:'undefined',
                id:'undefined',
                title:'undefined',
                state:'signOuted',
            })
            break;
        case 'CHANGE_TO_SIGN_OUT_STATE':
            return Object.assign({},preState,{
                user:'undefined',
                id:'undefined',
                title:'undefined',
                state:'uncheck',
            })
            break;  
        default:
            return preState
            break;
    }
}

export default shopReducer
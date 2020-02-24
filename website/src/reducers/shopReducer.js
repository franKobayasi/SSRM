import {ssrmDB} from "../useFirebase";
const initialState={
    user:'undefined',
    id:'undefined',
    title:'undefined',
    state:'uncheck',
    // /** 測試用 */
    // user:{
    //     id:'OgqYTiBjMWhiIDHqhvi0',
    //     name:'仲岳',
    // },
    // id:'mAHT8POZz1AhyW2CEXXp',
    // title:'Reborn中正台門市',
    // state:'signIned',
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
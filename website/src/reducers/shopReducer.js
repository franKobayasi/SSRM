import {ssrmDB} from "../useFirebase";
const initialState={
    user:{
        name:'仲岳',
        token:'H25sXb5Gi7I6qaypTiKQ',
    },
    id:'mAHT8POZz1AhyW2CEXXp',
    name:'Reborn中正台門市'
}

const shopReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'SHOP_SIGNINED':
            return Object.assign({},preState,{
                currentUser:action.currentUser,
                currentShop:action.currentShop, 
            })
            break;
        case 'SHOP_SIGNOUTED':
            return Object.assign({},preState,{
                currentUser:'undefined',
                currentShop:'undefined',    
            })
            break;
        case 'DELETE_SHOP ':
            return Object.assign({},preState,{
               
            })
            break;
        default:
            return preState
            break;
    }
}

export default shopReducer
const initialState='undefined';

/**
{
    id:"mAHT8POZz1AhyW2CEXXp",
    title:"Reborn中正台門市"
}
 */

const shopListReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'UPDATE_SHOP_LIST':
            return action.shopList;
            break;
        case 'CHANGE_TO_SIGN_OUT_STATE':
            return 'undefined';
            break;
        default:
            return preState
            break;
    }
}

export default shopListReducer;
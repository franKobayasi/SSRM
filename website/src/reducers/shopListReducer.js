const initialState=[];

const shopListReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'UPDATE_SHOP_LIST':
            return action.shopList
            break;
        default:
            return preState
            break;
    }
}

export default shopListReducer;
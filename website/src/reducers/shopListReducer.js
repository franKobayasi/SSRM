const initialState=[
    {
        id:"mAHT8POZz1AhyW2CEXXp",
        title:"Reborn中正台門市"
    },
    {
        id:"mAHT8POZz1AhyW2CEXXp",
        title:"Reborn中正台門市"
    },
    {
        id:"mAHT8POZz1AhyW2CEXXp",
        title:"Reborn中正台門市"
    }
];

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
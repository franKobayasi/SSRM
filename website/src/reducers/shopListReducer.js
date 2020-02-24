const initialState='undefined';

/** 測試用 */
// const initialState=[
//     {
//         id:"xbr8o2WLDHOjy06Cxjtz",
//         title:"Reborn舊金山門市"
//     },
//     {
//         id:"mAHT8POZz1AhyW2CEXXp",
//         title:"Reborn中正台門市"
//     },
//     {
//         id:"Sp5UarMneDYLHA8k5Kaz",
//         title:"Reborn東門門市"
//     }
// ]

const shopListReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'UPDATE_SHOP_LIST':
            console.log('update shopList');
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
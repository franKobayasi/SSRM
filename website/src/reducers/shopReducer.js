const initialState={
    currentUser:'undefined',
    currentShop:{
        id:'mAHT8POZz1AhyW2CEXXp',
        title:'新竹中正台門市'
    },
    currentUser:{
        name:'Frank',
        tokenID:'mAHT8POZz1AhyW2CEXXp'
    }    
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
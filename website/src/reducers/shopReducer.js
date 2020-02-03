const initialState={
    
}

const shopReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'ADD_NEW_SHOP':
            return Object.assign({},preState,{
                
            })
            break;
        case 'EDIT_SHOP_INFO':
            return Object.assign({},preState,{
                
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
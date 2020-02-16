const initialState={
    isFetch:false,
    isError:false,
}

const stateReducer=(preState=initialState,action)=>{
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
        case 'CHANGE_TO_SIGN_OUT_STATE':
            return Object.assign({},preState,{
                isFetch:false,
                isError:false,
            })
            break;
        default:
            return preState
            break;
    }
}

export default stateReducer;
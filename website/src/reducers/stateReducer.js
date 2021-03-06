const initialState={
    isFetch:false,
    isError:false,
}

const stateReducer=(preState=initialState,action)=>{
     if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'FETCH_START':
            return Object.assign({},preState,{
                isFetch:true,
            })
            break;
        case 'FETCH_FINISH':
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
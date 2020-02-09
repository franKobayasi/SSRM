const initialState={
    isFetch:false
}

const fetchReducer=(preState=initialState,action)=>{
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
        default:
            return preState
            break;
    }
}

export default fetchReducer;
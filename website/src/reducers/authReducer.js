const initialState={
    MEMBER_UID:'',
    isLogin:undefined,
}

const authReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'SIGN_IN':
            return Object.assign({},preState,{
                MEMBER_UID:action.MEMBER_UID,
                isLogin:true
            })
            break;
        case 'SIGN_OUT':
            return Object.assign({},preState,{
                MEMBER_UID:'',
                isLogin:false
            })
            break;
        // case 'RESET_PASSWORD':
        //     return Object.assign({},preState,{

        //     })
        //     break;
        // case 'UPDATE_PASSWORD':
        //     return Object.assign({},preState,{

        //     })
        //     break;
        default:
            return preState
            break;
    }
}

export default authReducer;
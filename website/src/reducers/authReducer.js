const initialState={
    // MEMBER_UID:'undefined',
    // MEMBER_NAME:'undefined', 
    // MEMBER_EMAIL:'undefined',
    // isLogin:'unconnect', 
    /** 測試用 */
    MEMBER_UID:'xKWbiVJJqAeGwy5FBZf1PQFKUm13',
    MEMBER_NAME:'仲岳', 
    MEMBER_EMAIL:'tofindeachotherandtofeel', 
    isLogin:true,  

}

const authReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'CHANGE_TO_SIGN_IN_STATE':
            return Object.assign({},preState,{
                MEMBER_UID:action.MEMBER_UID,
                MEMBER_NAME:action.MEMBER_NAME,
                MEMBER_EMAIL:action.MEMBER_EMAIL,
                isLogin:true
            })
            break;
        case 'CHANGE_TO_SIGN_OUT_STATE':
            return Object.assign({},preState,{
                MEMBER_UID:'undefined',
                MEMBER_NAME:'undefined',
                MEMBER_EMAIL:'undefined',
                isLogin:false
            })
            break;
        case 'FIREBASE_AUTH_FORBID':
            return Object.assign({},preState,{
                MEMBER_UID:'undefined',
                MEMBER_NAME:'undefined',
                MEMBER_EMAIL:'undefined',
                isLogin:'forbid'
            })
        default:
            return preState
            break;
    }
}

export default authReducer;
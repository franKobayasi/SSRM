const initialState={
    state:'undefined',
    uid:'undefined',
    name:'undefined',
    email:'undefined',
    shopList:[],
    currentUser:'undefined',
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
                MEMBER_UID:'',
                MEMBER_NAME:'',
                MEMBER_EMAIL:'',
                isLogin:false
            })
            break;
        case 'FIREBASE_AUTH_ERROR':
            return Object.assign({},preState,{
                MEMBER_UID:'',
                MEMBER_NAME:'',
                MEMBER_EMAIL:'',
                isLogin:'ERROR'
            })
        default:
            return preState
            break;
    }
}

export default authReducer;
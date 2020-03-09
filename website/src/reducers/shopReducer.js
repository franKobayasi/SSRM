import {ssrmDB} from "../useFirebase";
const initialState={
    status:'loading',
    title:'',
    address:'',
    tel:'',
    time:'',
    onCheckoutMode:true,
}

const shopReducer=(preState=initialState,action)=>{
    if(typeof preState==='undefined'){
        return initialState;
    }
    switch(action.type){
        case 'SHOP_SIGN_IN':
            return Object.assign({},preState,{
                status:'ready',
                title:action.title,
                address:action.address,
                tel:action.tel,
                time:action.time,
            })
            break;
        case 'SHOP_SIGN_OUT':
            return Object.assign({},preState,{
                status:'loading',
                title:'',
                address:'',
                tel:'',
                time:'',
            })
            break;
        case 'SHOP_CREATE':
            return Object.assign({},preState,{
                status:'create',
            })
            break;
        case 'TOGGLE_MODE':
            return Object.assign({},preState,{
                onCheckoutMode:!preState.onCheckoutMode,
            })
            break;
        default:
            return preState
            break;
    }
}

export default shopReducer
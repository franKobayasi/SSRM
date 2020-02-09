import {SIGN_IN, SIGN_OUT, RESET_PW, UPDATE_PW, FB_INIT,ADD_NEW_SHOP} from "./actionTypes";

export function actionSignIn(member){
    console.log(member);
    return {
        type:SIGN_IN,
        MEMBER_UID:member.uid,
        MEMBER_NAME:member.userName,
        MEMBER_EMAIL:member.email,
        shopList:member.shopList,
    }
}
export function actionSignOut() {
    return {
        type:SIGN_OUT,
    }
}
export function updatePassword(password,new_password) {
    return {
        type:UPDATE_PW,
        password,
        new_password
    }
}
export function resetPassword(email){
    return {
        type:RESET_PW,
        email
    }
}

export function addNewShop(){
    return {
        type:ADD_NEW_SHOP
    }
}
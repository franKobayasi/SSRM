import {SIGN_IN, SIGN_OUT, RESET_PW, UPDATE_PW} from "./actionTypes";

export function actionSignIn(user){
    return {
        type:SIGN_IN,
        MEMBER_UID:user.uid,
        isLogin:true,
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
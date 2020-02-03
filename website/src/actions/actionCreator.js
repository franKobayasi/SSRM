import {SIGN_IN, SIGN_UP, RESET_PW, UPDATE_PW} from "./actionTypes";

export function signIn(email,password) {
    return {
        type:SIGN_IN,
        email:email,
        password:password
    }
}

export function signUp(name,email,password) {
    return {
        type:SIGN_Up,
        name:name,
        email:email,
        password:password
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
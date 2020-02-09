const actionType={
    SIGN_IN:'CHANGE_TO_SIGN_IN_STATE',
    SIGN_OUT:'CHANGE_TO_SIGN_OUT_STATE',
    AUTH_ERROR:'FIREBASE_AUTH_ERROR',
}

export function actionSignIn(member){
    console.log(member);
    return {
        type:actionType.SIGN_IN,
        MEMBER_UID:member.uid,
        MEMBER_NAME:member.displayName,
        MEMBER_EMAIL:member.email,
    }
}
export function actionSignOut(){
    return {
        type:actionType.SIGN_OUT,
    }
}
export function actionAuthError(){
    return {
        type:actionType.AUTH_ERROR,
    }
}
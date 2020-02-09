const actionType={
    post:'FETCH_POST',
    success:'FETCH_SUCCESS',
    fail:'FETCH_FAIL',
}
export function actionFetchPosted(){
    return {
        type:actionType.post,
    }
}
export function actionFetchSuccessed(){
    return {
        type:actionType.success,
    }
}
export function actionFetchFailed(){
    return {
        type:actionType.fail,
    }
}
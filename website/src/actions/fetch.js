const actionType={
    start:'FETCH_START',
    finish:'FETCH_FINISH',
}
export function actionFetchStart(){
    return {
        type:actionType.start,
    }
}
export function actionFetchFinish(){
    return {
        type:actionType.finish,
    }
}
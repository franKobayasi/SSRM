const actionType={
    signIn:'SHOP_SIGN_IN',
    signOut:'SHOP_SIGN_OUT',
    create:'SHOP_CREATE',
    toggle:'TOGGLE_MODE',
}

export function actionShopSignIn(shop){
    return {
        type:actionType.signIn,
        title:shop.title,
        address:shop.address,
        tel:shop.tel,
        time:shop.time,
    }
}

export function actionShopSignOut(){
    return {
        type:actionType.signOut,
    }
}

export function actionShopCreate(){
    return {
        type:actionType.create,
    }
}

export function actionToggleShopMode(){
    return {
        type:actionType.toggle,
    }
}
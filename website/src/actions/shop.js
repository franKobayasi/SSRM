const actionType={
    signIn:'SHOP_SIGN_IN',
    signOut:'SHOP_SIGN_OUT'
}

export function actionShopSignIn(shop){
    console.log(shop);
    return {
        type:actionType.signIn,
        user:shop.user,
        id:shop.id,
        title:shop.title
    }
}

export function actionShopSignOut(){
    return {
        type:actionType.signOut,
    }
}
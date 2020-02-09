const actionType={
    update:'UPDATE_SHOP_LIST',
}
export function actionUpdateShopList(shopList){
    return {
        type:actionType.update,
        shopList,
    }
}
import React,{Component, Fragment} from "react";
import {connect} from "react-redux";
import {ssrmDB} from '../../../useFirebase';
import ShopSideNav from '../layout/ShopSideNav';
import OrderCreating from './OrderCreating';

class Purchase extends Component{
    constructor(props){
        super(props);
        this.state={
            /** 暫時假資料 */
            shopRef:ssrmDB.collection('members').doc(props.auth.MEMBER_UID).collection('shops').doc(props.shop.id),
            uncompletedNewOrder:JSON.parse(localStorage.getItem('uncompleted-purchase-newOrder')),
            unsavedHistoryOrder:JSON.parse(localStorage.getItem('unsaved-purchase-historyOrder')),
        }
    }
    componentDidMount(){
        let auth=this.props.auth;
        let shop=this.props.shop;
        /** get purchase data */
        ssrmDB.collection('members').doc(auth.MEMBER_UID).collection('shops').doc(shop.id).collection('purchases')
            .get()
            .then(snapshot=>{
                let purchaseOrderList=[];
                snapshot.forEach(doc=>{
                    if(doc.exists){
                        let order=doc.data();
                        order.id=doc.id;
                        purchaseOrderList.push(order);
                    }else{
                        console.log('no any purchase history yet')
                    }
                })
            })
            .catch(error=>{
                console.error("ERROR\n伺服器發生錯誤，目前無法獲取歷史訂單資料，請稍後再試")
                console.log(error);
            })
    }
    componentDidUpdate(){
    }
    render(){
        let uncompletedNewOrder=this.state.uncompletedNewOrder;
        let unsavedHistoryOrder=this.state.unsavedHistoryOrder;
        let uid=this.props.auth.MEMBER_UID;
        let shop=this.props.shop;
        shop.shopRef=this.state.shopRef;
        let location="new"
        return (
            <Fragment>
                <ShopSideNav />
                <div className="shopMainArea">
                    {
                        location==="new"?
                        <OrderCreating uncompletedNewOrder={uncompletedNewOrder} uid={uid} shop={shop} />:
                        (
                            location==="history"?
                            <div>HISTORY PAGE</div>:
                            <div>DETAIL PAGE</div>
                        )

                    }
                    
                </div>
            </Fragment>     
        )
    }
}

/** connect */
function mapStateToProps({auth,shop}){
    return {
        auth,shop
    }
}
export default connect(mapStateToProps)(Purchase);
import React,{Component, Fragment} from "react";
import {connect} from "react-redux";
import {ssrmDB} from '../../../useFirebase';
import ShopSideNav from '../layout/ShopSideNav';
import OrderCreating from './OrderCreating';
import OrderHistory from './OrderHistory';

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
    }
    componentDidUpdate(){
    }
    render(){
        let uncompletedNewOrder=this.state.uncompletedNewOrder;
        let unsavedHistoryOrder=this.state.unsavedHistoryOrder;
        let uid=this.props.auth.MEMBER_UID;
        let shop=this.props.shop;
        shop.shopRef=this.state.shopRef;
        let location="history"
        return (
            <Fragment>
                <ShopSideNav />
                {
                    location==="new"?
                    <OrderCreating uncompletedNewOrder={uncompletedNewOrder} uid={uid} shop={shop} />:
                    (
                        location==="history"?
                        <OrderHistory shop={shop} />:
                        <div>DETAIL PAGE</div>
                    )
                }
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
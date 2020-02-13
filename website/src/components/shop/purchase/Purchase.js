import React,{Component, Fragment} from "react";
import {connect} from "react-redux";
import {ssrmDB} from '../../../useFirebase';
import SideNav from '../../layout/SideNav';
import OrderCreating from './OrderCreating';

class Purchase extends Component{
    constructor(props){
        super(props);
        this.state={
            /** 暫時假資料 */
            shop:{
                currentShop:'Reborn中正台門市',
                currentUser:'Frank'
            },
            uncompletedNewOrder:JSON.parse(localStorage.getItem('uncompleted-purchase-newOrder')),
            unsavedHistoryOrder:JSON.parse(localStorage.getItem('unsaved-purchase-historyOrder')),
        }
    }
    componentDidMount(){
        ssrmDB.collection('members').doc(this.props.auth.MEMBER_UID).collection('shops').doc(this.props.shop.currentShop.id).collection('purchases').get()
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
        let location="new"
        return (
            <Fragment>
                <SideNav auth={this.props.auth} currentShop={this.props.shop.currentShop}/>
                <div className="shopMainArea">
                    {
                        location==="new"?
                        <OrderCreating uncompletedNewOrder={uncompletedNewOrder}/>:
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
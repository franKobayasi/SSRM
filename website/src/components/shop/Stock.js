import React,{ Component,Fragment } from "react";
import {connect} from "react-redux";
/** Component */
import SideNav from '../layout/SideNav';

class Stock extends Component{
    constructor(props){
        super(props);
        this.state={
            shop:{
                currentShop:'Reborn中正台門市',
                currentUser:'Frank'
            }
        }
    }
    render(){
        return (
            <Fragment>
                <SideNav auth={this.props.auth} currentShop={this.state.shop}/>
                <div className="shopMainArea"></div>
            </Fragment>
        )
    }
}



/** Purchase Component */
    // get unsaveOrder from localStorage to state
        // unsaveHistoryOrder
        // unsaveNewOrder
    // get purchase history from firebase purchase collection (前 20 筆資料) to state

/** 採購管理 歷史訂單 */
    // OrderHistory Func

/** 採購作業 歷史訂單詳細頁面 */
    // OrderDetail Func
    // 判斷是否存在未完成修改之採購單 Y render未儲存訂單 N 隨機產生採購單號 
    // 在有未儲存的採購單存在下點擊其他採購單時，跳出詢問框"尚有未完成修改的採購單，是否放棄編輯？"
        // 訂單編號 xxxxx 尚未完成編輯，是否繼續編輯
        // 取消並清除，render新傳入的採購單
        // 取消傳入，繼續編輯

/** 採購作業 採購登入 */
    // OrderCreating Func
    // 判斷是否存在未完成訂單 Y render未儲存訂單 N 隨機產生採購單號 
    // EDIT
    // LEAVE
        // 將未儲存的採購單資料存入localStorage ( 編輯中未確認或取消 )
            // 確認或取消後清除localStorage資料

function OrderDetail(props){
    let currentOrder;
    let unsaveHistoryOrder=props.unsaveHistoryOrder?props.unsaveHistoryOrder:undefined;
    if(!unsaveHistoryOrder){
        /** 無未完成修改訂單，傳入已完成訂單 */
        // currentOrder
    }else if(!unsaveHistoryOrder===currentOrder){
        // currentOrder=comfirm('有未完成之採購訂單是否放棄編輯？\nY 放棄\n 繼續編輯')?currentOrder:redirect uncompletedOrder;
    }else{
        // uncompletedOrder
    }
}
function OrderCreating(props){
    let unsaveNewOrder=props.unsaveNewOrder?props.unsaveNewOrder:undefined;
    let currentOrder;

    /** 無編輯中的訂單 */
    if(uncompletedOrder){
        /** 生成新訂單，並在每次操作中儲存至localStorage及父層的state */ 
        currentOrder.id=randomPurchaseOrderID() /** P for Purchase */
    }else{
        /** 有未完成訂單 */
        currentOrder=unsaveNewOrder;
    }
    return (
        <div>currentOrder</div>
    )
}













function mapStateToProps({auth}){
    return {
        auth,
    }
}
export default connect(mapStateToProps)(Stock);


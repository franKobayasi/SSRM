import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class OrderCreating extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
       
    }
    componentDidUpdate(){

    }
    render(){
        return (
            <Fragment>
                <SideNav />
                <div className="shopMainArea shopMainArea-stock-orderCreating">
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>進貨單登錄</div>
                            <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/stock/history`)}}>歷史進貨單</button>
                            <button className="btnForFormBig">庫存查詢</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="itemSelector">
                            <div className="orderFilter">
                                <span><input type="checkbox" value="isSearchNeedOrderID"/><label>採購單號</label><input id="searchOrderID" /></span>
                                <span><input type="checkbox" value="isSearchNeedSupplierName"/><label>供應商名稱</label><input id="searchBySupplierName"/></span>
                                <span><input type="checkbox" value="isSearchNeedSupplierTel"/><label>供應商電話</label><input id="searchBySupplierTel"/></span>
                                <span><input type="checkbox" value="isSearchNeedProductName"/><label>產品名稱</label><input id="searchByProductName"/></span>
                                <span>
                                    <input type="checkbox" value="isSearchNeedDateArea"/>
                                    <label>日期區間從</label><input id="searchByDateFrom"/>
                                    <label>至</label><input id="searchByDateTo"/>
                                </span>
                                <button>查詢</button>
                            </div>
                        </div>
                        <div>商品添加區</div>
                        <div>商品進貨處理區</div>
                    </div>
                </div>
            </Fragment>
        )
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>{
            return {
                [id]:value,
            }
        });
    }
}

export default OrderCreating;
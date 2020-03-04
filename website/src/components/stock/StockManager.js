import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class StockManager extends Component{
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
                            <button className="btnForFormBig">商品庫存查詢</button>
                        </div>
                    </div>
                    <div className="informationArea"></div>
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

export default StockManager;
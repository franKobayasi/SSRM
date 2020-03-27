import React,{Fragment, Component} from 'react';
import {getDateToYMD} from "../../lib";

/**
Need Props:
shopInfo(object: shop information)

 */

class ShopInfo extends Component{
    constructor(props){
        super(props);
        let shop=this.props.shop;
        this.state={
            isEdit:false,
            title:shop.title,
            address:shop.address,
            tel:shop.tel,
            time:shop.time
        }
    }

    submitShopSetting=()=>{

    }
    render(){
        let isEdit=this.state.isEdit;
        let title=this.state.title;
        let address=this.state.address;
        let tel=this.state.tel;
        let time=this.state.time;
        return (
             <div className="app-dashboard-shopInfo app-dashboard-block">
                <div className="app-dashboard-blockTitle">
                    店家基本資訊
                </div>
                <div className="fk-form app-dashboard-blockContent">
                    <div className="fk-form-row">
                        <label className="fk-form-cell-125px">店家名稱</label>
                        {
                            isEdit?
                            <input id="title" value={title}/>:
                            <span>{title}</span>
                        }
                    </div>
                    <div className="fk-form-row">
                        <label className="fk-form-cell-125px">地址</label>
                        {
                            isEdit?
                            <input id="address" value={address}/>:
                            <span>{address}</span>
                        }
                    </div>
                    <div className="fk-form-row">
                        <label className="fk-form-cell-125px">電話</label>
                        {
                            isEdit?
                            <input id="tel" value={tel} />:
                            <span>{tel}</span>
                        }
                    </div>
                    <div className="fk-form-row">
                        <label className="fk-form-cell-125px">運營起始日期：</label>
                        <span>{getDateToYMD(time,true)}</span>
                    </div>
                </div>
             </div>
        )
    }
}

export default ShopInfo;
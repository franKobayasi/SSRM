import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import {createHashHistory as history} from 'history';
import {ssrmDB} from "../../useFirebase";
import AppSideNav from "../common/AppSideNav";
import AppHeaderBar from "../common/AppHeaderBar";
import Guide from "../common/Guide";
import ShopInfo from "./ShopInfo";

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    componentWillUnmount(){
    }
    render(){
        let shop=this.props.shop;
        return (
            <Fragment>
                {
                    shop.status==='create'?
                    <Guide />:''
                }
                <AppSideNav />
                <AppHeaderBar />
                {
                    shop.status==='create'?
                    '':
                    <div className="app-pageMainArea">
                        <ShopInfo shop={shop}/>
                        <div className="app-dashboard-bussiSummary app-dashboard-block">
                            <div className="app-dashboard-blockTitle">今日營運摘要</div>
                            <div className="fk-form app-dashboard-blockContent">
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-125px">營業額：</label>
                                    <span>{0}</span>
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-125px">總交易筆數：</label>
                                    <span>{0}</span>
                                </div>
                                <div className="fk-form-row">
                                    <label>最大金額交易（前20筆）：</label>
                                </div>
                            </div>
                            <div className="fk-table--black">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-50px">排名</span>
                                    <span className="fk-table-cell-175px">結帳單號</span>
                                    <span className="fk-table-cell-75px">顧客</span>
                                    <span className="fk-table-cell-75px">交易件數</span>
                                    <span className="fk-table-cell-75px">金額</span>
                                </div>
                                <div className="fk-table-highlighter">目前無任何交易</div>
                            </div>
                        </div>
                        <div className="app-dashboard-pwReset app-dashboard-block">
                            <div className="app-dashboard-blockTitle">密碼重設</div>
                            <div className="app-dashboard-blockContent">
                                <button className="fx-btn--mainColor">重設權限密碼</button>
                                <button className="fx-btn--mainColor">重設會員密碼</button>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}
function mapStateToProps({shop}){
    return {
        shop,
    }
}
function mapDispatchToProps(dispatch){
    return {
        dispatch,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
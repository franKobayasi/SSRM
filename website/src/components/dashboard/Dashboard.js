import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import {createHashHistory as history} from 'history';
import ssrmFirebase from "../../useFirebase"; 
import {ssrmDB} from "../../useFirebase"; 
import {ajax,getDateToYMD,getMillSecondFromYMD} from "../../lib"; 
/** Action creator */
import {actionFetchStart, actionFetchFinish} from "../../actions/fetch";
/** Component */
import AppSideNav from "../common/AppSideNav";
import AppHeaderBar from "../common/AppHeaderBar";
import {Loading, LoadingFetching} from "../common/Loading";
import ShopInfo from "./ShopInfo";

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isShowRSPW:false,
            isShowRSMK:false,
            isMKRight:false,
            isMKSame:false,
            old_MK:'',
            new_MK:'',
            new_MK_check:'',
            remindMsg:'提示訊息',
            checkouts:'loading'
        }
    }
    render(){
        let shop=this.props.shop;
        let onPageLoading=this.state.onPageLoading;
        let checkouts=this.state.checkouts;
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
            {
                this.props.state.isFetch?
                <LoadingFetching text="資料庫更新中"/>:
                null
            }
            {
                this.state.isShowRSMK?
                <div className="app-dashboard-resetMK fk-popBox">
                    <div className="fk-popBox-title">重設店家權限密碼</div>
                    <div className="fk-popBox-content">
                        <div className="fk-popBox-content-center">
                            <div className="fk-form">
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">舊權限密碼</label>
                                    <input onChange={this.handleChange} id="old_MK" type="password" value={this.state.old_MK} />
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">新權限密碼</label>
                                    <input onChange={this.handleChange} id="new_MK" type="password" value={this.state.new_MK} />
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">再次輸入</label>
                                    <input onChange={this.handleChange} id="new_MK_check" type="password" value={this.state.new_MK_check}/>
                                </div>
                                <div className="fk-form-remindMsg">{this.state.remindMsg}</div>
                            </div>
                        </div>
                        <div className="fk-popBox-content-btns">
                            <button onClick={this.resetMasterKey} className="fx-btn--25LH-mainColor">送出</button>
                            <button onClick={()=>{this.toggleShowResetMK(false)}} className="fx-btn--25LH-mainColor">取消</button>
                        </div>
                    </div>
                </div>:
                null
            }
                <div className="app-pageMainArea">
                    <ShopInfo shop={shop}/>
                    <div className="app-dashboard-bussiSummary app-dashboard-block">
                        <div className="app-dashboard-blockTitle">今日營運摘要</div>
                        <div className="fk-form app-dashboard-blockContent">
                    {
                        checkouts==='loading'?
                        <Loading text="訂單資料載入中"/>:
                        <Fragment>
                            <div className="fk-form-row">
                                <label className="fk-form-cell-125px">營業額：</label>
                                <span>{this.getCheckoutsCalcResult()}</span>
                            </div>
                            <div className="fk-form-row">
                                <label className="fk-form-cell-125px">總交易件數：</label>
                                <span>{checkouts.length}</span>
                            </div>
                            <div className="fk-form-row">
                                <label>最大金額交易（前20筆）：</label>
                            </div>
                            <div className="fk-table--black">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-50px">排名</span>
                                    <span className="fk-table-cell-175px">結帳單號</span>
                                    <span className="fk-table-cell-75px">顧客</span>
                                    <span className="fk-table-cell-75px">交易件數</span>
                                    <span className="fk-table-cell-75px">金額</span>
                                    <span className="fk-table-cell-150px">時間</span>
                                </div>
                                <div className="fk-table-scrollArea">
                            {
                                checkouts.length>0?
                                this.getFirstTwentyOrders().map((checkout,index)=>(
                                <div key={index} className="fk-table-row">
                                    <span className="fk-table-cell-50px">{index+1}</span>
                                    <span className="fk-table-cell-175px">{checkout.id}</span>
                                    <span className="fk-table-cell-75px">{checkout.customerIdAndName[1]}</span>
                                    <span className="fk-table-cell-75px">{checkout.calcResult.sumOfNum}</span>
                                    <span className="fk-table-cell-75px">{checkout.calcResult.sumOfMoney}</span>
                                    <span className="fk-table-cell-150px">{getDateToYMD(checkout.time,true)}</span>
                                </div>)):
                                <div className="fk-table-highlighter">目前無任何交易</div>
                            }                
                                </div>                
                            </div>  
                        </Fragment>
                    }
                    </div>
                    </div>
                    <div className="app-dashboard-pwReset app-dashboard-block">
                        <div className="app-dashboard-blockTitle">密碼重設</div>
                        <div className="app-dashboard-blockContent">
                            <button onClick={()=>{this.toggleShowResetMK(true)}} className="fx-btn--mainColor">重設權限密碼</button>
                            <button onClick={this.sendPWResetEmail} className="fx-btn--mainColor">重設會員密碼</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
    componentDidMount(){
        let checkouts=[];
        let today=getMillSecondFromYMD(getDateToYMD(new Date().valueOf()));
        this.props.shopRef.collection('checkouts').where('time','>=',today).get()
        .then(snapshot=>{
            if(!snapshot.empty){
                snapshot.forEach(doc=>{
                    checkouts.push(doc.data());
                })
            }
            for(let i=0;i<checkouts.length-1;i++){
                if(checkouts[i].calcResult.sumOfMoney<checkouts[i+1].calcResult.sumOfMoney){
                    let temp=checkouts[i];
                    checkouts[i]=checkouts[i+1];
                    checkouts[i+1]=temp;
                }
            }
            this.setState(preState=>({
                checkouts,
            }))
        })
    }
    toggleShowResetPW=(bool)=>{
        this.setState(preState=>({
            isShowRSPW:bool, //Reset Password
        }))
    }
    toggleShowResetMK=(bool)=>{
        this.setState(preState=>({
            isShowRSMK:bool, // Reset MasterKey
        }))
    }
    getCheckoutsCalcResult=()=>{
        let checkouts=this.state.checkouts;
        let sum=0;
        for(let checkout of checkouts){
            sum+=Number(checkout.calcResult.sumOfMoney);
        }
        return sum;
    }
    getFirstTwentyOrders=()=>{
        let checkouts=this.state.checkouts.filter((checkout,index)=>{
            return index<=20;
        })
        return checkouts;
    }
    sendPWResetEmail=()=>{
        if(confirm('我們將會寄送帳戶密碼重設的連結至您所註冊的eamil信箱，是否繼續？')){
            let auth=ssrmFirebase.auth();
            auth.sendPasswordResetEmail(emailAddress).then(function() {
                alert(`重設連結已經寄至 ${emailAddress}，請至信箱重設密碼`);
            }).catch(function(error) {
                alert('重設失敗！');
            });
        }
    }
    resetMasterKey=()=>{
        let shopRef=this.props.shopRef;
        let api_URL='https://us-central1-ssrm-e7bc3.cloudfunctions.net/modifyMasterKey';
        let reqBody={
            uid:this.props.auth.MEMBER_UID,
            old_MK:this.state.old_MK,
            new_MK:this.state.new_MK
        }
        let dispatch=this.props.dispatch
        // start 
        dispatch(actionFetchStart());
        ajax('POST',api_URL,reqBody,null,(req)=>{
            dispatch(actionFetchFinish());
            let res=JSON.parse(req.response);
            if(res.status==='error'||res.status==='fail'){
                alert(res.message)
            }else{
                alert('權限密碼更新成功！');
            }
        })
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value.trim();
        let msg='OK';
        if(id==='new_MK'){
            if(value.length<4||!/[A-z]+\d+\w+/.test(value)){
                msg='權限密碼請以字母開頭並至少包含兩個數字，總長度至少4個字以上';
                this.setState(preState=>({                    
                    isMKRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isMKRight:true,
                }))
            }
        }
        if(id==='new_MK_check'){
            if(value!==this.state.new_MK){
                msg='兩次密碼不一致';
                this.setState(preState=>({                    
                    isMKSame:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isMKSame:true,
                }))
            }
        }
        this.setState((preState)=>{
            return {
                remindMsg:msg,
                [id]:value,
            }
        });
        this.setState((preState)=>{
            return {
                [id]:value,
                remindMsg:msg,
            }
        });
    }
}
function mapStateToProps({auth,shop,state}){
    return {
        auth,
        shop,
        state,
    }
}
function mapDispatchToProps(dispatch){
    return {
        dispatch,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
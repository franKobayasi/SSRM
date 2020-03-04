import React,{Fragment, Component} from 'react';
import {connect} from "react-redux";
import {ssrmDB} from "../../useFirebase";
import {actionShopSignIn} from '../../actions/shop';

class Guide extends Component{
    constructor(props){
        super(props);
        this.state={
            slide:1,
            title:'',
            address:'',
            tel:'',
            masterKey:'',
            masterKey_check:'',
            remindMsg:'提示訊息',
            isPWRight:false,
            isPWSame:false,
        }
    }
    setSlide=(index)=>{
        this.setState(preState=>({
            slide:index,
        }))
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        let msg='OK';
        if(id==='title'){
            if(value.length===0){
                msg='請輸入店家名稱（必填）';
            }
        }
        if(id==='masterKey'){
            if(value.length<4||!/[A-z]+\d+\w+/.test(value)){
                msg='權限密碼請以字母開頭並至少包含兩個數字，總長度至少4個字以上';
                this.setState(preState=>({                    
                    isPWRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isPWRight:true,
                }))
            }
        }
        if(id==='masterKey_check'){
            if(value!==this.state.masterKey){
                msg='兩次密碼不一致';
                this.setState(preState=>({                    
                    isPWSame:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isPWSame:true,
                }))
            }
        }
        this.setState((preState)=>{
            return {
                remindMsg:msg,
                [id]:value,
            }
        });
    }
    submitShopSetting=()=>{
        let uid=this.props.auth.MEMBER_UID;
        let title=this.state.title;
        let address=this.state.address;
        let tel=this.state.tel;
        let masterKey=this.state.masterKey;
        let isPWRight=this.state.isPWRight;
        let isPWSame=this.state.isPWSame;
        if(title.length===0){
            alert('請填寫店家名稱（必填）');
        }else if(!isPWRight){
            alert('權限密碼尚未設定或格式錯誤');
        }else if(!isPWSame){
            alert('兩次權限密碼輸入不一致');
        }else{
            let shopInfo={
                title,
                tel:tel.length>0?tel:'尚未填寫',
                address:address.length>0?address:'尚未填寫',
                masterKey,
                time:new Date().valueOf()
            }
            ssrmDB.collection('shops').doc(uid).set(shopInfo)
            .then(res=>{
                alert('完成設定！開始使用SSRM吧！');
                delete shopInfo.masterKey;
                this.props.dispatch(actionShopSignIn(shopInfo));
            })
        }
    }
    render(){
        let title=this.state.title;
        let address=this.state.address;
        let tel=this.state.tel;
        let masterKey=this.state.masterKey;
        let masterKey_check=this.state.masterKey_check;
        let remindMsg=this.state.remindMsg;
        return (
             <div className="app-blackCover">
                <div className="app-guide">
                    <div className={`app-guide-slider-${this.state.slide}`}>
                    <span className="app-guide-box">
                        <span className="app-guide-title">關於SSRM</span>
                        <span className="app-guide-content">
                            <span>SSRM 為一個針對小型服飾店家所開發的輕量級資源管理系統，涵蓋採購、進貨、結帳及營業數據分析等功能。
                            
                            希望透過本軟件解決小型服飾商家在資源管理方面的需求，讓店家能專注在服飾商品的品質與顧客服務。</span> 
                        </span>
                        <button className="app-guide-actionBtn fx-btn--onlyText" onClick={
                            ()=>{this.setSlide(2)}}>NEXT</button>
                    </span>
                    <span className="app-guide-box">
                        <span className="app-guide-title">使用導覽</span>
                        <span className="app-guide-content">
                            <span>接下來，我們將簡單的說明如何SSRM的操作方式，未來仍可透過系統導覽功能更深入的了解如何使用本系統。<br/>
                            為了避免一般店員接觸到較敏感數據資料，SSRM具有兩種模式：結帳模式／後台模式。 <br/>
                            結帳模式用於店面日常結帳收營操作，僅能操作結帳、帳單查詢、修改及刪除、庫存查詢、新增顧客資料等等基礎操作。<br/>
                            後台模式為敏感資料的操作，如採購、進貨、營業數據報 告、店家設定等，兩種模式的切換需要透過輸入權限密碼來達成。</span>
                        </span>
                        <button className="app-guide-actionBtn--left fx-btn--onlyText" onClick={
                            ()=>{this.setSlide(1)}}>PREVIOUS</button>
                        <button className="app-guide-actionBtn fx-btn--onlyText" onClick={
                            ()=>{this.setSlide(3)}}>NEXT</button>
                    </span>
                    <span className="app-guide-box">
                        <span className="app-guide-title">基礎設定</span>
                        <span className="app-guide-content">
                            <span className="fk-form">
                                <div className="fk-form-row">
                                    <label>店家名稱</label>
                                    <input id="title" onChange={this.handleChange} name="title" type="text" value={title} placeholder="required"/>
                                </div>
                                <div className="fk-form-row">
                                    <label>地址</label>
                                    <input id="address" onChange={this.handleChange} name="address" type="text" value={address} placeholder="optional" />
                                </div>
                                <div className="fk-form-row">
                                    <label>電話</label>
                                    <input id="tel" onChange={this.handleChange} name="tel" type="text" value={tel} placeholder="optional" />
                                </div>
                                <div className="fk-form-row">
                                    <label>權限密碼</label>
                                    <input id="masterKey" onChange={this.handleChange} name="masterKey" type="password" value={masterKey} placeholder="required" />
                                </div>
                                <div className="fk-form-row">
                                    <label>再次輸入</label>
                                    <input id="masterKey_check" onChange={this.handleChange} name="masterKey_check" type="password" value={masterKey_check} placeholder="required" />
                                </div>
                                <div className="fk-form-remindMsg">{remindMsg}</div>
                            </span>
                        </span>
                        <button className="app-guide-actionBtn--left fx-btn--onlyText" onClick={
                            ()=>{this.setSlide(2)}}>PREVIOUS</button>
                        <button className="app-guide-actionBtn fx-btn--onlyText" onClick={this.submitShopSetting}>DONE</button>
                    </span>
                    </div>
                </div>
             </div>
        )
    }
}

function mapStateToProps({auth}){
    return {
        auth,
    }
}
function mapDispatchToProps(dispatch){
    return {
        dispatch,
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Guide);
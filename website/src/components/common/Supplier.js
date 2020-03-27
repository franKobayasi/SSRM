import React,{ Component,Fragment } from "react";
import {Loading} from './Loading';

/**
    Need Props: 
    shopRef(use to access shop's database)
    toggle(a function with props boolean use to show or hide this form)

    no connect to store, pure func for view render. 
    has its own state to keep user input.

    <SupplierAddingForm shopRef={} toggle={} />
 */
class FormSupplierEntry extends Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            address:'',
            tel:'',
            remindMsg:'提示訊息',
        }
    }
    render(){
        let title=this.state.title;
        let address=this.state.address;
        let tel=this.state.tel;
        let remindMsg=this.state.remindMsg;
        return (
        <form className="app-supplier-entryForm fk-popBox">
            <div className="fk-popBox-title">新增供應商</div>
            <div className="fk-popBox-content">
                <div className="fk-popBox-content-center fk-form">
                    <div className="fk-form-row">
                        <label>供應商</label>
                        <input id="title" value={title} onChange={this.handleChange}/>
                    </div>
                    <div className="fk-form-row">
                        <label>地址</label>
                        <input id="address" value={address} onChange={this.handleChange}/>
                    </div>
                    <div className="fk-form-row">
                        <label>電話</label>
                        <input id="tel" value={tel} onChange={this.handleChange} placeholder={"電話將作為未來供應商查詢使用"}/>
                    </div>
                    <div className="fk-form-remindMsg">{remindMsg}</div>
                </div>
                <div className="fk-popBox-content-btns">
                    <button className="fx-btn--25LH-mainColor" onClick={this.submitNewSupplier}>完成</button>
                    <button className="fx-btn--25LH-mainColor" onClick={(e)=>{
                        e.preventDefault();
                        this.props.toggle(false)}}>取消</button>
                </div>
            </div>
        </form>
        )
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value.trim();
        let msg="OK"
        if(id==='title'){
            if(value.length<3){
                msg='供應商名稱過短';
                this.setState(preState=>({
                    isTitleRight:false,
                }))
            }else{
                this.setState(preState=>({
                    isTitleRight:true,
                }))
            }
        }else if(id==='address'){
            if(value.length<5){
                msg='地址過短，至少5個字以上';
                this.setState(preState=>({
                    isAdressRight:false,
                }))
            }else{
                this.setState(preState=>({
                    isAdressRight:true,
                }))
            }
        }else if(id==='tel'){
            if(value.length<5){
                msg='電話過短，至少5個字以上';
                this.setState(preState=>({
                    isTelRight:false,
                }))
            }else{
                this.setState(preState=>({
                    isTelRight:true,
                }))
            }
        }
        this.setState((preState)=>{
            return {
                [id]:value,
                remindMsg:msg,
            }
        });
    }
    
    /** 註冊新供應商 */
    submitNewSupplier=(e)=>{
        e.preventDefault();
        let title=this.state.title;
        let address=this.state.address;
        let tel=this.state.tel;
        let isTitleRight=this.state.isTitleRight;
        let isTelRight=this.state.isTelRight;
        let isAdressRight=this.state.isAdressRight;
        if(!isTitleRight){
            alert('供應商名稱尚未輸入或長度不足3個字');
        }else if(!isAdressRight){
            alert('供應商地址尚未輸入或長度不足5個字');
        }else if(!isTelRight){
            alert('供應商電話尚未輸入或長度不足5個字');
        }else{
            (async()=>{
                let result= await this.checkSupplier(tel);
                if(result.data){
                    alert('供應商已存在，若供應商電話有重複或更改請至店家設定頁面更改');
                }else{
                    await this.props.shopRef.collection('suppliers').doc().set({title,tel,address})
                    .then((res)=>{
                        alert('註冊成功！');
                        this.props.toggle(false);
                        return ;
                    })
                    .catch(error=>{
                        console.error("ERRPR\n註冊供應商時，資料庫寫入錯誤");
                        console.log(error);
                    })
                }
            })();
        }
    }
    /** 確認此供應商是否註冊過 */
    checkSupplier=async(tel)=>{
        let result={};
        await this.props.shopRef.collection('suppliers').where('tel','==',tel).limit(1).get()
        .then(snapshot=>{
            if(!snapshot.empty){
                snapshot.forEach(doc=>{
                    if(!doc.exists){
                        result.message='查無供應商資料，請先新增'
                        return ;
                    }else{
                        result.data=[
                            doc.id,
                            doc.data().title
                        ]
                        return ; 
                    }
                })
            }else{
                result.message='查無供應商資料，請先新增'
                return ;
            }
        })
        .catch(error=>{
            result.message='ERROR\n查詢確認供應商資料失敗'
            console.error(`${result.message}`);
            console.log(error);
            return ;
        })
        return result;
    }
}

class Supplier extends Component{
    constructor(props){
        super(props);
        this.state={
            isShowDetail:false
        }
    }
    asyncSupplierInfo=async()=>{
        let supplierID=this.props.supplierIdAndTitle[0];
        let doc=await this.props.shopRef.collection('suppliers').doc(supplierID).get().then();
        this.setState(preState=>({
            detail:doc.data()
        }))
    }
    render(){
        let supplierIdAndTitle=this.props.supplierIdAndTitle;
        let isShowDetail=this.state.isShowDetail;
        let detail=this.state.detail;
        /** 此地傳進來 supplier 陣列的格式
        [0] title [1]address [2] tel
         */
        return (
            <Fragment>
            <button onClick={()=>{this.toggleShowDetail(true)}} className="app-supplier-showDetailBtn fx-btn--25LH-mainColor">{supplierIdAndTitle.length===2?supplierIdAndTitle[1]:'供應商'}</button>
            {
                this.state.isShowDetail?
                <div className="app-supplier-detail fk-popBox">
                    <div className="fk-popBox-title">供應商詳情</div>
                    <div className="fk-popBox-content fk-form">
                    {
                        detail?
                        <>
                        <div className="fk-form-row">
                            <label>供應商</label>
                            <span className="SupplierDetail">{detail.title}</span>
                        </div>
                        <div className="fk-form-row">
                            <label>商家電話</label>
                            <span className="SupplierAddress">{detail.tel}</span>
                        </div>
                        <div className="fk-form-row">
                            <label>商家地址</label>
                            <span className="SupplierAddress">{detail.address}</span>
                        </div>
                        <div className="fk-popBox-content-btns">
                            <button onClick={()=>{this.toggleShowDetail(false)}} className="fx-btn--25LH-mainColor">關閉</button>
                        </div>
                        </>:
                        <Loading text='供應商資料載入中'/>
                    }
                    </div>
                </div>:null
            }
            </Fragment>
        )
    }
    toggleShowDetail=(bool)=>{
        if(this.props.supplierIdAndTitle.length===2){
            if(bool){
                this.asyncSupplierInfo();
            }
             this.setState(preState=>({
                isShowDetail:bool
            }),)
        }else{
            alert('請先完成供應商查詢或新增');
        }
    }
}

export {FormSupplierEntry};
export default Supplier;
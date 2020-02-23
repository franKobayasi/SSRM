import React,{ Component,Fragment } from "react";

/**
    Need Props: 
    shopRef(use to access shop's database)
    toggle(a function with props boolean use to show or hide this form)

    no connect to store, pure func for view render. 
    has its own state to keep user input.

    <SupplierAddingForm shopRef={} toggle={} />
 */
class Supplier extends Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            address:'',
            tel:''
        }
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
    
    /** 註冊新供應商 */
    submitNewSupplier=()=>{
        let title=this.state.title.trim();
        let address=this.state.address.trim();
        let tel=this.state.tel.trim();
        if(!title||title.length===0){
            alert('請輸入供應商名稱');
        }else if(!address||address.length===0){
            alert('請輸入供應商地址');
        }else if(!tel||tel.length===0){
            alert('請輸入供應商電話');
        }else{
            (async()=>{
                let result= await this.checkSupplier(tel);
                if(result.supplier){
                    alert('供應商已存在，若供應商電話有重複或更改請至店家設定頁面更改');
                }else{
                    await this.props.shopRef.collection('suppliers').doc(tel).set({title,address})
                    .then((res)=>{
                        alert('註冊成功！');
                        return ;
                    })
                    .catch(error=>{
                        console.error("ERRPR\n註冊供應商時，資料庫寫入錯誤");
                        console.log(error);
                    })
                }
                this.props.toggle(false);
            })();
        }
    }
    render(){
        return (
        <form className="supplierAddingForm">
            <div><label>供應商</label><input id="title" onChange={this.handleChange}/></div>
            <div><label>地址</label><input id="address" onChange={this.handleChange}/></div>
            <div><label>電話</label><input id="tel" onChange={this.handleChange} placeholder={"電話將作為未來供應商查詢使用"}/></div>
            <div className="buttons">
                <button className="finish" onClick={this.submitNewSupplier}>完成</button>
                <button className="cancel" onClick={()=>{this.props.toggle(false)}}>取消</button>
            </div>
        </form>
        )
    }
    /** 確認此供應商是否註冊過 */
    checkSupplier=async (tel)=>{
        let result={};
        await this.props.shopRef.collection('suppliers').doc(tel).get()
        .then(doc=>{
            if(!doc.exists){
                result.message='查無供應商資料，請先新增'
                return ;
            }else{
                result.supplier={
                    title:doc.data().title,
                    address:doc.data().address,
                    tel:doc.id
                }
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

function SupplierInfo(props){
    return (
        <Fragment>
            <span className="title">供應商：</span>
            <span className="SupplierDetail">{props.title?props.title:'尚未進行查詢輸入'}</span>
            <span className="title">商家電話：</span>
            <span className="SupplierAddress">{props.tel}</span>
            <span className="title">商家地址：</span>
            <span className="SupplierAddress">{props.address}</span>
        </Fragment>
    )
}

export {SupplierInfo};
export default Supplier;
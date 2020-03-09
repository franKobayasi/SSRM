import React,{Fragment,Component} from "react";
import {connect} from "react-redux";
import {ssrmDB} from "../../useFirebase";

/**
Need Props:
toggle(show or hide Stock Checker)

 */
class StockChecker extends Component{
    constructor(props){
        super(props);
        this.state={
            // prodcut: undefined - loading - data
        }
    }
    render(){
        let product=this.state.product;
        return (
            <div className="fk-popBox app-StockChecker">
                <div className="fk-popBox-title">庫存查詢</div>
                <div className="fk-popBox-content">
                    <div className="fk-form">
                        <div className="fk-form-row">
                            <label>請輸入欲查詢的商品ID</label>
                        </div>
                        <div className="fk-form-row">
                            <input onKeyPress={this.searchViaEnterasync} onChange={this.keyInItemID} placeholder="輸入後按enter或點按查詢"/>
                            <button onClick={this.search} className="fx-btn--onlyText-black">查詢</button>
                        </div>
                    </div>
                    <div className="app-StockChecker-result fk-form">
                        <div className="fk-form-row">
                            <label>Result</label>
                        </div>
                    {   
                        !product?
                        <div className="fk-form-remindMsg">請於上方對話框輸入商品ID</div>:
                        product==='loading'?
                        <div className="fk-form-remindMsg">查詢中...</div>:
                        <Fragment>
                            <div className="fk-form-row">
                                <label>商品</label>
                                <span>{`${product.name}/${product.size}/${product.color}`}</span>
                            </div>
                            <div className="fk-form-row">
                                <label>剩餘庫存</label>
                                <span>{product.stocks}</span>
                            </div>
                        </Fragment>
                    }
                    </div>
                    <div className="fk-popBox-content-btns">
                        <button onClick={()=>{this.props.toggle(false)}} className="fx-btn--25LH-mainColor">關閉</button>
                    </div>
                </div>
            </div>
            
        )
    }
    keyInItemID=(evnt)=>{
        let value=evnt.target.value.trim();
        this.setState((preState)=>{
            return {
                itemID:value,
            }
        });
    }
    search=async(evnt)=>{
        console.log('start searching');
        let itemID=this.state.itemID;
        if(itemID){
            let result={};
            this.setState(preState=>({
                product:'loading',
            }))        
            await this.getItemData(result,itemID);
            if(result&&result.product){
                console.log(result.product);
                this.setState(preState=>({
                    product:result.product,
                }))
            }else{
                alert(`${result.message}`);
            }
        }else{
            alert('尚未輸入商品ID!');
        }
    }
    searchViaEnterasync=(evnt)=>{
        console.log('start searching');
        let keyCode=evnt.charCode;
        if(keyCode===13){
            this.search();
        }
    }
    async getItemData(result,itemID){
        await ssrmDB.collection('shops').doc(this.props.auth.MEMBER_UID).collection('products').doc(itemID).get()
        .then(doc=>{
            if(doc.exists){
                let product=doc.data();
                delete product.cost;
                result.product=product;
            }else{
                result.msg='找不到符合的商品';
            }
        })
        .catch(error=>{
            result.msg="查詢過程發生錯誤";
            console.error('ERROR\n 商品查詢過程發生錯誤');
            console.log(error);
        })
    }
}

function mapStateToProps({auth}){
    return {
        auth,
    }
}

export default connect(mapStateToProps)(StockChecker)




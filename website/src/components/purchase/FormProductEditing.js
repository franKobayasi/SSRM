import React,{ Component,Fragment } from "react";
import {randomProductID} from "../../lib";
import checkImg from "../../img/check.png";
import editImg from "../../img/editBtn.png";
import deleteImg from "../../img/deleteBtn.png";

class FormProductEditing extends Component{
    constructor(props){
        super(props);
        let CP=this.props.currentProduct;
        this.state={ 
            productID:CP.productID,
            name:CP.name,
            cost:CP.cost,
            price:CP.price,
            startAt:CP.startAt,
            itemList:CP.itemList,
            tempSize:'',
            tempColor:'',
            tempNum:''
        }
    }
    componentDidMount(){

    }
    render(){
        let CP=this.state;
        return (
            <div className="formProductEdit fk-popBox">
                <div className="fk-popBox-title">新增產品</div>
                <div className="fk-popBox-content">
                    <div className="fk-popBox-content-center formProductEdit">
                        <div className="fk-popBox-content-center fk-form">
                            <div className="fk-form-row">
                                <label className="highlight">產品編號</label>
                                <span className="highlight">{CP.productID}</span>
                            </div>
                            <div className="fk-form-row">
                                <label >商品名稱</label>
                                <input id="name" onChange={this.handleChange} defaultValue={CP.name} />
                            </div>
                            <div className="fk-form-row">
                                <label>進貨成本</label>
                                <input id="cost" onChange={this.handleChange} defaultValue={CP.cost} />
                            </div>
                            <div className="fk-form-row">
                                <label>商品標價</label>
                                <input id="price" onChange={this.handleChange} defaultValue={CP.price} />
                            </div>
                        </div>
                        <div className="specAddingArea">
                            <label>尺寸</label><input id="tempSize" onChange={this.handleChange} value={CP.tempSize}/>
                            <label>顏色</label><input id="tempColor" onChange={this.handleChange} value={CP.tempColor}/>
                            <label>件數</label><input id="tempNum" onChange={this.handleChange}  value={CP.tempNum}/>
                            <img className="fx-btn--Img-25px" src={checkImg} onClick={this.addSpec} />
                        </div>
                        <div className="productSpecArea">
                            {CP.itemList.length===0?
                            <div>請添加商品</div>:
                            CP.itemList.map((item,itemIndex)=>(
                                item.isEdit?
                                <div key={itemIndex}> {/** 如果在編輯狀態 */}
                                    <div className="editBlock">
                                        <span>尺寸</span>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'size',evnt.target.value)}} defaultValue={item.size}/>
                                        <span>顏色</span>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'color',evnt.target.value)}} defaultValue={item.color} />
                                        <span>件數</span>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'num',evnt.target.value)}} defaultValue={item.num} />
                                    </div>
                                    <div className="fx-btn--Img-25px">
                                        <img src={checkImg} onClick={()=>{this.checkOutEditSpec(itemIndex)}} />
                                    </div>
                                </div>:
                                <div key={itemIndex}> {/** 如果不是在編輯狀態 */}
                                    <div className="infoBlock">
                                        <span>尺寸：{item.size}</span><span>顏色：{item.color}</span><span>件數：{item.num}</span>
                                    </div>
                                    <div className="fx-btn--Img-25px">
                                        <img src={editImg} onClick={()=>{this.checkOutEditSpec(itemIndex)}} />
                                    </div>
                                    <div className="fx-btn--Img-25px">
                                        <img src={deleteImg} className="fx-btn--Img-25px" onClick={()=>{this.removeSpec(itemIndex)}} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="formBtnArea">
                            <button className="btnForFormLittle" onClick={this.submitProductSpecs}>完成</button>
                            <button className="btnForFormLittle" onClick={this.props.cancelUpdateProduct} >取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    isNotNumber(num){
        return isNaN(Number(num));
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value.trim().toUpperCase();
        this.setState((preState)=>{
            return {
                [id]:value,
            }
        });
    }
    addSpec=()=>{
        let isNotNumber=this.isNotNumber;
        let size=this.state.tempSize;
        let num=Number(this.state.tempNum);
        let color=this.state.tempColor;
        if(size.length===0){
            alert("請輸入尺寸");
        }else if(num.length===0){
            alert("請輸入件數");
        }else if(isNotNumber(num)){
            alert("件數並非數值，請確認");
        }else if(color.length===0){
            alert("請輸入顏色");
        }else{
            let CP=Object.assign({},this.state);
            /** 如果添加重複規格 */
            let isSame=false;
            for(let item of CP.itemList){
                if(item.size===CP.tempSize&&item.color===CP.tempColor){
                    isSame=true; /** 發生重複 */
                    alert("不可重複添加相同規格商品");
                }
            }
            if(!isSame){ /** 如果沒重複 */
                CP.itemList.push({
                    itemID:`${CP.productID}${CP.startAt++}`,
                    size,
                    color,
                    num,
                    inStock:0,
                    status:'purchase',
                })
                this.setState(preState=>({
                    startAt:CP.startAt,
                    tempSize:'',
                    tempColor:'',
                    tempNum:'',
                    itemList:CP.itemList
                }))
            }
        }   
    }
    checkOutEditSpec=(target)=>{
        let itemList=this.state.itemList.concat([]);
        itemList[target]['isEdit']=!itemList[target]['isEdit'];
        this.setState(preState=>({
            itemList,
        }))
    }
    updateSpec=(target,key,value)=>{
        let itemList=this.state.itemList.concat([]);
        if(key==='num'){
            itemList[target][key]=Number(value);
        }else{
            itemList[target][key]=value.toUpperCase();
        }
        this.setState(preState=>({
            itemList,
        }))
    }
    removeSpec=(target)=>{
        let itemList=this.state.itemList.filter((item,itemIndex)=>(!(itemIndex===target)));
        this.setState(preState=>({
            itemList,
        }))
    }
    submitProductSpecs=()=>{
        let name=this.state.name;
        let cost=this.state.cost;
        let price=this.state.price;
        let itemList=this.state.itemList;
        let isNotNumber=this.isNotNumber;
        if(name.length===0){
            alert('請輸入產品名稱');
        }else if(cost.length===0){
            alert('請輸入產品成本');
        }else if(isNotNumber(cost)){
            alert('成本並非數值，請確認')
        }else if(price.length===0){
            alert('請輸入售價');
        }else if(isNotNumber(price)){
            alert('售價並非數值，請確認');
        }else if(itemList.length===0){
            alert('尚未新增任何產品規格，請新增');
        }else{
            if(confirm('確定完成商品編輯？')){
                let productSpecs={ 
                    productID:this.state.productID,
                    name,
                    cost:Number(cost),
                    price:Number(price),
                    itemList,
                    startAt:this.state.startAt,
                }
                this.props.submitProductSpecs(productSpecs);
            }
        }
    }
}

export default FormProductEditing;
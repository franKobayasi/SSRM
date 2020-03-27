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
            itemList:CP.itemList.concat([]),
            tempSize:'',
            tempColor:'',
            tempNum:'',
            isNameRight:CP?true:false,
            isCostRight:CP?true:false,
            isPriceRight:CP?true:false,
            remindMsg:'提示訊息',
            remindMsg_Spec:'提示訊息'
        }
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
                            <div className="fk-form-remindMsg">{this.state.remindMsg}</div>
                        </div>
                        <div className="specAddingArea">
                            <label>尺寸</label><input id="tempSize" onChange={this.handleChange} value={CP.tempSize}/>
                            <label>顏色</label><input id="tempColor" onChange={this.handleChange} value={CP.tempColor}/>
                            <label>件數</label><input id="tempNum" onChange={this.handleChange}  value={CP.tempNum}/>
                            <div className="fx-btn--Img-25px" >
                                <img src={checkImg} onClick={this.addSpec} />
                            </div>
                        </div>
                        <div className="productSpecArea">
                            {CP.itemList.length===0?
                            <div className="productSpecArea-noSpecHighLight">請添加商品</div>:
                            CP.itemList.map((item,itemIndex)=>(
                                item.isEdit?
                                <div className="productSpecArea-row" key={itemIndex}> {/** 如果在編輯狀態 */}
                                    <span className="productSpecArea-row-info">
                                        <label>尺寸</label>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'size',evnt.target.value)}} value={item.size}/>
                                        <label>顏色</label>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'color',evnt.target.value)}} value={item.color} />
                                        <label>件數</label>
                                        <input onChange={(evnt)=>{this.updateSpec(itemIndex,'num',evnt.target.value)}} value={item.num} />
                                        <div id="remindMsg_Spec">{this.state.remindMsg_Spec}</div>
                                    </span>
                                    <span className="productSpecArea-row-btns">
                                        <div className="fx-btn--Img-25px">
                                            <img src={checkImg} onClick={()=>{this.checkOutEditSpec(itemIndex)}} />
                                        </div>
                                    </span>
                                </div>:
                                <div className="productSpecArea-row" key={itemIndex}> {/** 如果不是在編輯狀態 */}
                                    <span className="productSpecArea-row-info">
                                        <label>尺寸</label><span>{item.size}</span>
                                        <label>顏色</label><span>{item.color}</span>
                                        <label>件數</label><span>{item.num}</span>
                                    </span>
                                    <span className="productSpecArea-row-btns">
                                        <div className="fx-btn--Img-25px">
                                            <img src={editImg} onClick={()=>{this.checkOutEditSpec(itemIndex)}} />
                                        </div>
                                        <div className="fx-btn--Img-25px">
                                            <img src={deleteImg} onClick={()=>{this.removeSpec(itemIndex)}} />
                                        </div>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="fk-popBox-content-btns">
                            <button className="fx-btn--25LH-mainColor" onClick={this.submitProductSpecs}>完成</button>
                            <button className="fx-btn--25LH-mainColor" onClick={this.props.cancelUpdateProduct} >取消</button>
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
        let value=evnt.target.value;
        let msg='OK';
        if(id==='name'){
            let isNameRight=false;
            value=value.trim().toUpperCase();
            if(value.length===0){
                msg="請輸入商品名稱";
            }else{
                isNameRight=true;
            }
            this.setState(preState=>({
                isNameRight
            }))
        }
        if(id==='price'){
            let isPriceRight=false;
            if(this.isNotNumber(value)){
                msg="價格輸入錯誤，請輸入正確的數值";
            }else{
                isPriceRight=true;
            }
            this.setState(preState=>({
                isPriceRight
            }))
        }
        if(id==='cost'){
            let isCostRight=false;
            if(this.isNotNumber(value)){
                msg="成本輸入錯誤，請輸入正確的數值";
            }else{
                isCostRight=true;
            }
            this.setState(preState=>({
                isCostRight
            }))
        }
        this.setState((preState)=>{
            return {
                [id]:value,
                remindMsg:msg
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
                    status:'purchase'
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
        let item=itemList[target];
        if(item.isEdit&&item.isWrongSpec){
            alert('產品規格有誤，請確認！');
        }else{
            itemList[target]['isEdit']=!itemList[target]['isEdit'];
            this.setState(preState=>({
                itemList
            }))
        }
    }
    updateSpec=(target,key,value)=>{
        let itemList=this.state.itemList.concat([]);
        let msg="OK!";
        if(key==='num'){
            let item=itemList[target];
            if(item.inStock>value){
                msg="採購數量不能低於已進貨數量！";
                item.num=Number(value);
                item.isWrongSpec=true;
            }else if(isNaN(Number(value))){
                msg="格式錯誤，請輸入數字！"
                item.num=value;
                item.isWrongSpec=true;
            }else{
                item.num=Number(value);
                delete item.isWrongSpec;
            }
        }else{
            itemList[target][key]=value.toUpperCase();
        }
        this.setState(preState=>({
            itemList,
            remindMsg_Spec:msg
        }))
    }
    removeSpec=(target)=>{
        let preItemList=this.state.itemList;
        if(preItemList[target].inStock===0){
            let itemList=preItemList.filter((item,itemIndex)=>(!(itemIndex===target)));
            this.setState(preState=>({
                itemList
            }))
        }else{
            alert('此規格商品已經進貨，無法移除');
        }
    }
    submitProductSpecs=()=>{
        let name=this.state.name;
        let cost=this.state.cost;
        let price=this.state.price;
        let isNameRight=this.state.isNameRight;
        let isCostRight=this.state.isCostRight;
        let isPriceRight=this.state.isPriceRight;
        let itemList=this.state.itemList;
        if(!isNameRight){
            alert('產品名稱尚未輸入');
        }else if(!isCostRight){
            alert('產品成本未輸入或格式錯誤');
        }else if(!isPriceRight){
            alert('產品價格未輸入或格式錯誤');
        }else if(confirm('確定完成商品編輯？')){
            let productSpecs={ 
                productID:this.state.productID,
                name,
                cost:Number(cost),
                price:Number(price),
                itemList,
                startAt:this.state.startAt
            }
            this.props.submitProductSpecs(productSpecs);
        }
    }
}

export default FormProductEditing;
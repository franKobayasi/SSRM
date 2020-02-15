import React,{ Component,Fragment } from "react";
import {randomProductID} from "../../../lib";
import checkImg from "../../../img/check.png";
import editImg from "../../../img/editBtn.png";
import deleteImg from "../../../img/deleteBtn.png";

class FormProductEditing extends Component{
    constructor(props){
        super(props);
        this.state={
            id:'loading',
            name:'',
            cost:'',
            price:'',
            startAt:1,
            itemList:[],
            tempSize:'',
            tempColor:'',
            tempNum:''
        }
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
        if(this.state.tempSize.length===0){
            alert("請輸入尺寸");
        }else if(this.state.tempNum.length===0){
            alert("請輸入件數");
        }else if(this.state.tempColor.length===0){
            alert("請輸入顏色");
        }else{
            let product=Object.assign({},this.state);
            /** 如果添加重複規格 */
            let isSame=false;
            for(let item of product.itemList){
                if(item.size===product.tempSize&&item.color===product.tempColor){
                    isSame=true; /** 發生重複 */
                    alert("不可重複添加相同規格商品");
                }
            }
            if(!isSame){ /** 如果沒重複 */
                product.itemList.push({
                    itemID:`${product.id}${product.startAt++}`,
                    size:product.tempSize,
                    color:product.tempColor,
                    num:product.tempNum
                })
                this.setState(preState=>({
                    startAt:product.startAt,
                    tempSize:'',
                    tempColor:'',
                    tempNum:'',
                    itemList:product.itemList
                }))
            }
        }   
    }
    checkOutEditSpec=(target)=>{
        let itemList=this.state.itemList.concat([]);
        itemList[target]['isEdit']=!itemList[target]['isEdit'];
        this.setState(preState=>({
            itemList:itemList
        }))
    }
    updateSpec=(target,key,value)=>{
        let itemList=this.state.itemList.concat([]);
        itemList[target][key]=value.toUpperCase();
        this.setState(preState=>({
            itemList:itemList
        }))
    }
    removeSpec=(target)=>{
        console.log(`remove..${target}`);
        let itemList=this.state.itemList.filter((spec,index)=>(!(index===target)));
        console.log(itemList);
        this.setState(preState=>({
            itemList:itemList
        }))
    }
    submitNewProduct=()=>{
        if(this.state.name.length===0){
            alert('請輸入產品名稱');
        }else if(this.state.cost.length===0){
            alert('請輸入產品成本');
        }else if(this.state.price.length===0){
            alert('請輸入售價');
        }else if(this.state.itemList.length===0){
            alert('尚未新增任何產品規格，請新增');
        }else{
            if(confirm('確定完成商品編輯？')){
                let productToSubmit={
                    id:this.state.id,
                    name:this.state.name,
                    cost:this.state.cost,
                    price:this.state.price,
                    itemList:this.state.itemList,
                    startAt:this.state.startAt
                }
                console.log(productToSubmit);
                this.props.submitNewProduct(productToSubmit);
            }
        }
    }
    componentDidMount(){
        let product=this.props.product;
        this.setState(preState=>({
            id:product.id,
            name:product.name,
            cost:product.cost,
            price:product.price,
            startAt:product.startAt,
            itemList:product.itemList
        }))
    }
    render(){
        let product=this.state;
        return (
            <form className="addNewProductForm">
                <div className="basicInfoArea">
                    <div className="productID">{`產品編號: ${product.id}`}</div>
                    <div><label className="title">商品名稱</label><input id="name" onChange={this.handleChange} defaultValue={product.name} /></div>
                    <div><label className="title">進貨成本</label><input id="cost" onChange={this.handleChange} defaultValue={product.cost} /></div>
                    <div><label className="title">商品標價</label><input id="price" onChange={this.handleChange} defaultValue={product.price} /></div>
                </div>
                <div className="specAddingArea">
                    <label>尺寸</label><input id="tempSize" onChange={this.handleChange} value={this.state.tempSize}/>
                    <label>顏色</label><input id="tempColor" onChange={this.handleChange} value={this.state.tempColor}/>
                    <label>件數</label><input id="tempNum" onChange={this.handleChange}  value={this.state.tempNum}/>
                    <img className="specAdding_btn" src={checkImg} onClick={this.addSpec} />
                </div>
                <div className="productSpecArea">
                    {product.itemList.length===0?
                    <div>請添加商品</div>:
                    product.itemList.map((item,index)=>(
                        item.isEdit?
                        <div key={index}> {/** 如果在編輯狀態 */}
                            <div className="editBlock">
                                <span>尺寸</span>
                                <input onChange={(evnt)=>{this.updateSpec(index,'size',evnt.target.value)}} defaultValue={item.size}/>
                                <span>顏色</span>
                                <input onChange={(evnt)=>{this.updateSpec(index,'color',evnt.target.value)}} defaultValue={item.color} />
                                <span>件數</span>
                                <input onChange={(evnt)=>{this.updateSpec(index,'num',evnt.target.value)}} defaultValue={item.num} />
                            </div>
                            <img className="specCheck_btn" src={checkImg} onClick={()=>{this.checkOutEditSpec(index)}} />
                        </div>:
                        <div key={index}> {/** 如果不是在編輯狀態 */}
                            <div className="infoBlock">
                                <span>尺寸：{item.size}</span><span>顏色：{item.color}</span><span>件數：{item.num}</span>
                            </div>
                            <img className="specEdit_btn" src={editImg} onClick={()=>{this.checkOutEditSpec(index)}} />
                            <img src={deleteImg} className="removeSpec_btn" onClick={()=>{this.removeSpec(index)}} />
                        </div>
                    ))}
                </div>
                <div className="formBtnArea">
                    <button className="btnForFormL" onClick={this.submitNewProduct}>完成</button>
                    <button className="btnForFormL" onClick={this.props.cancelUpdateProduct} >取消</button>
                </div>
            </form>
        )
    }
}

export default FormProductEditing;
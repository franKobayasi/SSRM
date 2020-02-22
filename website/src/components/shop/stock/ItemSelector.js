import React,{Component,Fragment} from 'react';
/** component */
import PurchaseOrderFilter from '../common/PurchaseOrderFilter';
import SelectedOrder from './SelectedOrder';
import Checkbox from '../common/Checkbox';

/**
Need Props:
shopRef(for firebase data search)
isShow(wheather show this component to view)
callback(get itemList back to OrderCreating component)
*/

class ItemSelector extends Component{
    constructor(props){
        super(props);
        this.state={
            orderSelected:null,
            tempItemState:null,
            isAllSelected:false,
            orderSearchResult:null
        }
    }
    componentDidMount(){
       
    }
    componentDidUpdate(){

    }
    render(){
        let orderSearchResult=this.state.orderSearchResult;
        let orderSelected=this.state.orderSelected;
        return (
            <div className={`itemSelector ${this.props.isShow?'showItemSelector':''}` }>
                <div className="orderSearchArea">
                    {/* PurchaseOrderFilter */}
                    <PurchaseOrderFilter shopRef={this.props.shopRef} callback={this.getSearchResult}/>
                    <div className="orderSelector table">
                        <div className="head">
                            <span className="orderID">採購單號</span>
                            <span className="supplierTitle">供應商名稱</span>
                            <span className="supplierTel">供應商電話</span>
                            <span className="percentageOfStock">進貨完成度</span>
                        </div>
                        {   
                            orderSearchResult?
                            orderSearchResult.map((order,index)=>(
                                <OlderSummary active={orderSelected?orderSelected.id===order.id?true:false:false} key={index} order={order} selectOrder={()=>{this.selectOrder(index)}}/>
                            )):
                            <div>沒有搜尋到任何符合條件的訂單</div>
                        }
                    </div>
                </div>
                <SelectedOrder orderSelected={orderSelected} callback={this.getItemListBackToTap} changeItemState={this.changeItemState}   
                toSelectAll={this.toSelectAll} isAllSelected={this.state.isAllSelected} tempItemState={this.state.tempItemState} />
            </div>
        )
    }
    
    /** handle SelectedOrder's item */
    changeItemState=(itemID)=>{
        let tempItemState=Object.assign({},this.state.tempItemState);
        tempItemState[itemID]=!tempItemState[itemID];
        this.setState(preState=>({
            tempItemState,
        }))
    }
    toSelectAll=()=>{
        let tempItemState=Object.assign({},this.state.tempItemState);
        for(let key in tempItemState){
            tempItemState[key]=!this.state.isAllSelected;
        }
        this.setState(preState=>({
            tempItemState,
            isAllSelected:!preState.isAllSelected,
        }))
    }
    getItemListBackToTap=()=>{
        let order={};
        let itemList=[];
        let orderSelected=Object.assign({},this.state.orderSelected);
        let tempItemState=this.state.tempItemState;
        if(!orderSelected.itemList){
            alert('尚未選擇欲進貨的採購單');
        }else{
            for(let item of orderSelected.itemList){
                if(tempItemState[item.itemID]){
                    itemList.push(item);
                }
            }
            if(itemList.length===0){
                alert('尚未添加任何商品');
            }
            order.itemList=itemList;
            order.purchaseID=orderSelected.id;
            this.props.callback(order);
            this.setState(preState=>({
                isAllSelected:false,
                orderSelected:null,
                tempItemState:null,
            }))
        }
    }
    getSearchResult=(result)=>{
        this.setState(preState=>({
            orderSearchResult:result,
        }))
    }
    selectOrder=(index)=>{
        let orderSelected=this.transform(this.state.orderSearchResult[index]);
        let tempItemState={};
        for(let item of orderSelected.itemList){
            tempItemState[item.itemID]=false;
        }
        this.setState(preState=>({
            orderSelected,
            tempItemState,
        }))
    }
    /** 將採購單的格式簡化 */
    transform=(order)=>{
        let orderSelected;
        if(order){
            orderSelected={};
            orderSelected.id=order.id;
            orderSelected.itemList=[];
            order.products.map((product)=>{
                for(let item of product.itemList){
                    item.name=product.name;
                    orderSelected.itemList.push(item);
                }
            })
        }
        return orderSelected;
    }
}

function OlderSummary(props){
    return (
        <div onClick={props.selectOrder} className={`olderSummary btn row ${props.active?'active':''}`}>
            <span className="orderID">{props.order.id}</span>
            <span className="supplierTitle">{props.order.supplierTitle}</span>
            <span className="supplierTel">{props.order.supplierTel}</span>
            <span className="percentageOfStock">計算中</span>
        </div>
    )
}
function showPercentage(order){
    let number="10%";
    let style={
        width:number
    }
    return (
        <span className="showPercentage">
            <span className="color" style={style}>.</span>{number}
        </span>
    )
}

export default ItemSelector;
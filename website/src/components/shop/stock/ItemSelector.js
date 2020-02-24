import React,{Component,Fragment} from 'react';
/** component */
import PurchaseOrderFilter from '../common/PurchaseOrderFilter';
import SelectedOrder from './SelectedOrder';
import Checkbox from '../common/Checkbox';
import ShowPercentage from '../common/ShowPercentage';

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
    
    getSearchResult=(result)=>{
        this.setState(preState=>({
            orderSearchResult:result,
        }))
    }
    selectOrder=(index)=>{
        /** 讓已經完成進貨的商品的不要被選到 */
        let orderSearchResult=this.state.orderSearchResult;
        let orderSelected=Object.assign({},orderSearchResult[index])
        if(this.props.orderType==='stockin'){
           orderSelected.itemList=orderSelected.itemList.filter(item=>{
               return item.status!='finish';
           });
        }
        let tempItemState={};
        for(let item of orderSelected.itemList){
            tempItemState[item.itemID]=false;
        }
        this.setState(preState=>({
            orderSelected,
            tempItemState,
        }))
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
                    delete item.status;
                    item.operateNum=0;
                    itemList.push(item);
                }
            }
            if(itemList.length===0){
                alert('尚未添加任何商品');
            }else{
                order.itemList=itemList;
                order.purchaseID=orderSelected.id;
                order.updateTimes=orderSelected.updateTimes;
                this.props.callback(order);
                this.setState(preState=>({
                    isAllSelected:false,
                    orderSelected:null,
                    tempItemState:null,
                }))
            }
        }
    }
}

function OlderSummary(props){
    let order=props.order
    return (
        <div onClick={props.selectOrder} className={`olderSummary btn row ${props.active?'active':''}`}>
            <span className="orderID">{order.id}</span>
            <span className="supplierTitle">{order.search_supplier[0]}</span>
            <span className="supplierTel">{order.search_supplier[2]}</span>
            <span className="percentageOfStock"><ShowPercentage order={order}/></span>
        </div>
    )
}

export default ItemSelector;
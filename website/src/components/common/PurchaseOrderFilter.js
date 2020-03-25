import React,{Component, Fragment} from 'react';
import {getDateToYMD, getMillSecondFromYMD} from '../../lib';
import Checkbox from './Checkbox';


/**
This Component is return an filter that can and particular v\Purchase order collection to callback.
Now Support  order and Checkout orders.
Need Props:
callback(send data back when query is finish)
orderRef(order FB ref)
 */

 class PurchaseOrderFilter extends Component{
    constructor(props){
        super(props);
        let to=getDateToYMD(new Date().valueOf());
        let from=getDateToYMD(new Date(new Date().valueOf()-(24*60*60*1000*14)).valueOf());
        this.state={
            isSearchNeedOrderID:false,
            isSearchNeedSupplierName:false,
            isSearchNeedDateArea:true,
            defaultSearchByDateFrom:from,
            defaultSearchByDateTo:to,
            searchByDateFrom:'',
            searchByDateTo:'',
            searchBySupplierName:'',
            searchOrderID:''
        }
    }
    render(){
        return (
            <div className="app-filter">
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedOrderID} onClick={()=>{this.setState(preState=>({isSearchNeedOrderID:!preState.isSearchNeedOrderID}))}} />
                    <label>採購單號</label>
                    <input onChange={this.handleChange}  id="searchOrderID" />
                </span>
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedSupplierName} onClick={()=>{this.setState(preState=>({isSearchNeedSupplierName:!preState.isSearchNeedSupplierName}))}} />
                    <label>供應商名稱</label>
                    <input onChange={this.handleChange}  id="searchBySupplierName" />
                </span>
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedDateArea} onClick={()=>{this.setState(preState=>({isSearchNeedDateArea:!preState.isSearchNeedDateArea}))}} />
                    <label>日期區間從</label>
                    <input className="date" onChange={this.handleChange} type='date' id="searchByDateFrom" defaultValue={this.state.defaultSearchByDateFrom}/>
                    <label>至</label>
                    <input className="date" onChange={this.handleChange}  type='date' id="searchByDateTo" defaultValue={this.state.defaultSearchByDateTo} />
                </span>
                <button className="app-filter-actionBtn fx-btn--25LH-mainColor" onClick={this.searchPurchaseOrder}>查詢</button>
            </div>
        )
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>({
            [id]:value
        }));
    }
    searchPurchaseOrder=()=>{
        let isSearchNeedOrderID=this.state.isSearchNeedOrderID;
        let isSearchNeedSupplierName=this.state.isSearchNeedSupplierName;
        let isSearchNeedDateArea=this.state.isSearchNeedDateArea;
        let searchOrderID=this.state.searchOrderID;
        let searchBySupplierName=this.state.searchBySupplierName;
        let targetRef=this.props.orderRef;
        if(isSearchNeedOrderID&&searchOrderID.length===0){
            alert('在勾選以採購單號搜尋時，該欄位不得為空');
        }else if(isSearchNeedSupplierName&&searchBySupplierName.length===0){
            alert('在勾選以供應商名稱搜尋時，該欄位不得為空');
        }else{
            if(isSearchNeedOrderID){
                targetRef=targetRef.where('id','==',`${searchOrderID}`);
            }
            if(isSearchNeedSupplierName){               
                targetRef=targetRef.where('search_supplier','array-contains',`${searchBySupplierName}`)
            }
            if(isSearchNeedDateArea){
                let from=this.state.searchByDateFrom?this.state.searchByDateFrom:this.state.defaultSearchByDateFrom;
                let to=this.state.searchByDateTo?this.state.searchByDateTo:this.state.defaultSearchByDateTo;
                from=getMillSecondFromYMD(from);
                to=getMillSecondFromYMD(to)+((23*60+59)*60*1000);
                if(from>to){
                    from=to-((23*60+59)*60*1000);
                }
                targetRef=targetRef.where('time','>=',from).where('time','<=',to);
            }
            this.props.callback(targetRef);
        }
    }
 }

 export default PurchaseOrderFilter;
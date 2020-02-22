import React,{Component, Fragment} from 'react';
import Checkbox from './Checkbox';


/**
This Component is return an filter that can and particular v\Purchase order collection to callback.
Now Support  order and Checkout orders.
Need Props:
callback(send data back when query is finish)
shopRef(firebase database)
 */

 class PurchaseOrderFilter extends Component{
    constructor(props){
        super(props);
        let to=new Date().valueOf();
        let from=new Date(to-(24*60*60*1000*14)).valueOf();
        this.state={
            isSearchNeedOrderID:false,
            isSearchNeedSupplierName:false,
            isSearchNeedSupplierTel:false,
            isSearchNeedProductName:false,
            isSearchNeedDateArea:true,
            defaultSearchByDateFrom:from,
            defaultSearchByDateTo:to,
            searchByDateFrom:'',
            searchByDateTo:'',
            searchByProductName:'',
            searchBySupplierTel:'',
            searchBySupplierName:'',
            searchOrderID:''
        }
    }
    render(){
        let options=this.state.options;
        return (
            <div className="searchBar">
                <span><Checkbox value={this.state.isSearchNeedOrderID} onClick={()=>{this.setState(preState=>({isSearchNeedOrderID:!preState.isSearchNeedOrderID}))}} /><label>採購單號</label>
                <input onChange={this.handleChange}  id="searchOrderID" /></span>
                <span><Checkbox value={this.state.isSearchNeedSupplierName} onClick={()=>{this.setState(preState=>({isSearchNeedSupplierName:!preState.isSearchNeedSupplierName}))}} /><label>供應商名稱</label>
                <input onChange={this.handleChange}  id="searchBySupplierName" /></span>
                <span><Checkbox value={this.state.isSearchNeedSupplierTel} onClick={()=>{this.setState(preState=>({isSearchNeedSupplierTel:!preState.isSearchNeedSupplierTel}))}} /><label>供應商電話</label>
                <input onChange={this.handleChange}  id="searchBySupplierTel" /></span>
                <span><Checkbox value={this.state.isSearchNeedProductName} onClick={()=>{this.setState(preState=>({isSearchNeedProductName:!preState.isSearchNeedProductName}))}} /><label>產品名稱</label>
                <input onChange={this.handleChange}  id="searchByProductName" /></span>
                <span>
                    <Checkbox value={this.state.isSearchNeedDateArea} onClick={()=>{this.setState(preState=>({isSearchNeedDateArea:!preState.isSearchNeedDateArea}))}} /><label>日期區間從</label>
                    <input onChange={this.handleChange} type='date' id="searchByDateFrom" defaultValue={this.state.defaultSearchByDateFrom}/>
                    <label className="toDate">至</label>
                    <input onChange={this.handleChange}  type='date' id="searchByDateTo" defaultValue={this.state.defaultSearchByDateTo} />
                </span>
                <button className="btnForFormLittle searchBtn" onClick={this.searchPurchaseOrder}>查詢</button>
                <div className="note">（系統默認搜尋過去15天內的採購單，如需尋找特定時段，請設定日期區間）</div>
            </div>
        )
    }
    componentDidMount(){

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
        let isSearchNeedSupplierTel=this.state.isSearchNeedSupplierTel;
        let isSearchNeedProductName=this.state.isSearchNeedProductName;
        let isSearchNeedDateArea=this.state.isSearchNeedDateArea;
        let searchOrderID=this.state.searchOrderID;
        let searchBySupplierName=this.state.searchBySupplierName;
        let searchBySupplierTel=this.state.searchBySupplierTel;
        let searchByProductName=this.state.searchByProductName;
        let purchaseRef=this.props.shopRef.collection('purchases');

        if(isSearchNeedOrderID&&searchOrderID.length===0){
            alert('在勾選以採購單號搜尋時，該欄位不得為空');
        }else if(isSearchNeedSupplierName&&searchBySupplierName.length===0){
            alert('在勾選以供應商名稱搜尋時，該欄位不得為空');
        }else if(isSearchNeedSupplierTel&&searchBySupplierTel.length===0){
            alert('在勾選以供應商電話搜尋時，該欄位不得為空');
        }else if(isSearchNeedProductName&&searchByProductName.length===0){
            alert('在勾選以商品名稱搜尋時，該欄位不得為空');
        }else{
            if(isSearchNeedOrderID){
                console.log('0');
                purchaseRef=purchaseRef.where('id','==',`${searchOrderID}`);
            }
            if(isSearchNeedSupplierName){
                console.log('1');
                purchaseRef=purchaseRef.where('supplierTitle','==',`${searchBySupplierName}`)
            }
            if(isSearchNeedSupplierTel){
                console.log('2');
                purchaseRef=purchaseRef.where('supplierTel','==',`${searchBySupplierName}`)
            }
            if(isSearchNeedProductName){
                console.log('3');
                purchaseRef=purchaseRef.where('nameOfProducts','array-contains',`${searchByProductName}`)
            }
            if(isSearchNeedDateArea){
                let from=this.state.searchByDateFrom?this.state.searchByDateFrom:this.state.defaultSearchByDateFrom
                let to=this.state.searchByDateTo?this.state.searchByDateTo:this.state.defaultSearchByDateTo
                purchaseRef=purchaseRef.where('time','<',to).where('time','>',from);
                console.log(from,to);
            }
            purchaseRef.get().then(snapshut=>{
                if(snapshut.empty){
                    console.log('it\'s empty')
                }else{
                    let orderSearchResult=[];
                    snapshut.forEach(doc=>{
                        orderSearchResult.push(doc.data());
                    })
                    this.props.callback(orderSearchResult);
                }
            })
        }
    }
 }

 export default PurchaseOrderFilter;
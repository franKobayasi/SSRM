import React,{Component,Fragment} from "react";
import {useHistory} from "react-router-dom";
import {connect} from "react-redux";
import {createHashHistory as history} from 'history';
import ssrmFirebase,{ssrmDB,getDataFromFireBase} from "../../useFirebase";
import SideNav from "../layout/SideNav";
import {actionUpdateShopList} from "../../actions/shopList";

class ShopSummary extends Component{
    constructor(props){
        super(props);
        this.state={
            isEdit:false,
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
    switchEditState=()=>{
        this.setState((preState)=>{
            return {
                isEdit:!preState.isEdit,
                newMasterKey:'',
                newMasterKeyChecker:'',
                oldMasterKey:'',
                tempShopTitle:'',
            }
        });
    }
    render(){
        let isEdit=this.state.isEdit;
        return (
            <div id={this.props.shopID} className={isEdit?"shopBoxOnEdit":"shopBox"} title={this.props.title} onClick={this.props.toShop}>
                <div className="imgContainer">
                    {this.props.title[0]}
                </div>
                {isEdit?
                <div>
                    <input id="tempShopTitle" onChange={this.handleChange} defaultValue={this.props.title}/>
                    <span className="changeShopTitle_btn btn" onClick={(evnt)=>{
                        console.log('更新中..');
                        this.props.updateShopInfo(evnt,this.state.tempShopTitle,'title');
                    }}>變更</span>
                </div>:
                <div>{this.props.title}</div>}
                {isEdit?
                <div>
                    <div className="passwordChangeInputs">
                        <input onChange={this.handleChange} id="oldMasterKey" placeholder="舊密碼"/>
                        <input onChange={this.handleChange} id="newMasterKey" placeholder="新密碼"/>
                        <input onChange={this.handleChange} id="newMasterKeyChecker" placeholder="再次確認"/>
                    </div>
                    <button className="passwordChanger_Btn btn">變更密碼</button>
                    <span className="goBack btn" onClick={this.switchEditState}>返回</span>
                </div>:
                <div>
                    <button onClick={this.props.deleteShop}>刪除</button>
                    <button onClick={()=>{this.setState((preState)=>{
                        return {
                            isEdit:true,
                        }
                    })}}>編輯</button>
                </div>}
            </div>
        )
    }
}

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state={
            isNeedUpdate:true,
            isShopCreating:false,
            tempShopTitle:'',
            tempMasterKey:'',
            tempMasterKeyCheck:'',
        }
    }
    componentDidMount(){
    }
    componentDidUpdate(){
        /** 初始化抓取資料 */
        if(this.state.isNeedUpdate){
            console.log('component update');
            (async ()=>{
                await this.asyncShopListFromFirebase();
                this.setState(preState=>({
                    isNeedUpdate:false,
                }));
            })();
        }
    }
    componentWillUnmount(){
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
    /** show or hide shop create form */
    startShopCreating=()=>{
        this.setState(preState=>{
            return {
                isShopCreating:true,
            }
        })
    }
    cancelShopCreating=()=>{
        this.setState(preState=>{
            return {
                isShopCreating:false,
                tempShopTitle:'',
                tempMasterKey:'',
                tempMasterKeyCheck:'',
            }
        });
    }
    createNewShop=()=>{
        let name=this.props.auth.MEMBER_NAME;
        let uid=this.props.auth.MEMBER_UID;
        let shopList=this.props.shopList;
        let title=this.state.tempShopTitle
        let masterKey=this.state.tempMasterKey;
        let masterKeyCheck=this.state.tempMasterKeyCheck;
        let shopsRef=ssrmDB.collection('members').doc(uid).collection('shops');
        if(!(masterKey===masterKeyCheck)){
            alert("密碼不一致，請確認");
        }else{
            if(masterKey.length<5){
                alert("密碼過短，至少輸入5位數");
            }else{
                let shop={title, currentUser:'undefined'}; // shop document的初始狀態
                shopsRef.where('title','==',title).get()
                .then(snapshot=>{
                    if(snapshot.empty){
                        shopsRef.add(shop)
                        .then(docRef=>{
                            shopsRef.doc(docRef.id).collection('users')
                            .add({type:'owner', name:name, password:masterKey})
                            .then(res=>{
                                console.log('create sccesss');
                                this.setState(preState=>({
                                    isNeedUpdate:true,
                                    isShopCreating:false,
                                    tempShopTitle:'',
                                    tempMasterKey:'',
                                    tempMasterKeyCheck:'',
                                }));
                            })
                        })
                        .catch((error)=>{
                            console.error('ERROR on FIREBASE: create new shop fail: 創建新店家發生錯誤')
                            console.log(error);
                        })
                    }else{
                        alert(`店家名稱"${title}"重複，無法新增，請新增其他未重複的名稱`);
                    }
                })
                .catch(error=>{
                    console.error('ERROR\n搜尋店家列表時發生錯誤');
                    console.log(error);
                })
            }
        }
    }
    deleteShop=(evnt)=>{
        let target=evnt.target.parentNode.parentNode;
        if(confirm(`確定刪除${target.title}?`)){
            ssrmDB.collection('members').doc(this.props.auth.MEMBER_UID).collection('shops').doc(target.id).delete();
            this.setState(preState=>({isNeedUpdate:true}));
        }
    }
    updateShopInfo=(evnt,value,type)=>{
        let target=evnt.target.parentNode.parentNode;
        if(type==='title'){
            if(target.title===value||value===undefined){
                alert('名稱未更改，請確認');
            }else if(confirm(`確定將${target.title}改名為${value}?`)){
                ssrmDB.collection('members').doc(this.props.auth.MEMBER_UID).collection('shops').doc(target.id).update({
                    title:value
                }).then(()=>{
                    alert('變更成功！')
                    this.setState(preState=>({isNeedUpdate:true}));
                }).catch(()=>{
                    alert('變更失敗')
                })
                
            }
        }
        
    }
    toShop=(id)=>{
        return function(evnt){
            if(evnt.target.id===id)
                history().push(`/shop/${id}`);
        }
    }
    asyncShopListFromFirebase=()=>{
        ssrmDB.collection('members').doc(this.props.auth.MEMBER_UID).collection('shops').get()
        .then(snapshot=>{
            let shopList=[];
            if(snapshot.empty){
                console.log(`ShopList is Empty, ${this.props.auth.MEMBER_UID}`)
            }
            snapshot.forEach(doc=>{
                let shop={
                    id:doc.id,
                    title:doc.data().title
                };
                shopList.push(shop);
            })
            /** this is dispatch extends from high level connet method */
            this.props.updateShopList(shopList);
        })
    }
    render(){
        let shopList=this.props.shopList;
        return (
            <Fragment>
                <SideNav />
                <div id="dashboard-main">
                    { /** handle shopList */
                        shopList!=='undefined'&&shopList.length>=1?
                        shopList.map((shop,index)=>{
                            return <ShopSummary toShop={this.toShop(shop.id)} key={index} title={shop.title} shopID={shop.id} login={shop.login} deleteShop={this.deleteShop} updateShopInfo={this.updateShopInfo}/>}):
                            shopList==='undefined'?
                            <div>shop loading...</div>:
                            <div className="noShopsMsg">尚未建立任何商家</div>
                    }
                    {   /** shop creating and editing form */
                        this.state.isShopCreating?
                        <form className="shopCreator">
                            <div>新增店家</div>
                            <input id="tempShopTitle" type="text" placeholder="商家名稱" onChange={this.handleChange}/>
                            <input id="tempMasterKey" type="password" placeholder="管理者密碼" onChange={this.handleChange}/>
                            <input id="tempMasterKeyCheck" type="password" placeholder="密碼確認" onChange={this.handleChange}/>
                            <button onClick={this.createNewShop}>確認</button>
                            <button onClick={this.cancelShopCreating}>取消</button>
                        </form>:
                        <div id="creatNewShop_btn" onClick={this.startShopCreating}>+</div>
                    }
                </div>
            </Fragment>
        )
    }
}
function mapStateToProps({auth,shopList},ownProps){
    return {
        auth,
        shopList,
    }
}
function mapDispatchToProps(dispatch,ownProps){
    const updateShopList=(shopList)=>{
        return dispatch(actionUpdateShopList(shopList));
    }
    return {
        updateShopList,
        dispatch,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
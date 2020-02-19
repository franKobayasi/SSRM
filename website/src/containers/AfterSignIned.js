import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect,
    useParams,
    useLocation,
} from 'react-router-dom';
/** firebase */
import {ssrmDB} from "../useFirebase";
/** action creator */
import {actionUpdateShopList} from "../actions/shopList";
/** component */
import MemberAuth from '../components/auth/MemberAuth';
import Dashboard from '../components/dashboard/Dashboard.js';
import Shop from '../components/shop/Shop.js';
import Stock from '../components/shop/Stock';

/** enter the app */
class AfterSignIned extends Component{
    constructor(props){
        super(props);

    }
    componentDidMount(){
        this.asyncShopListFromFirebase();
    }
    render(){
        if(this.props.shopList==="undefined"){
            console.log('shopList is undefined');
            return <div>loading..</div>
        }
        return (
            <Router> 
                <Switch>
                    {/* <Route path="/test" render={()=><Purchase />} /> */}
                    <Route path="/auth/:type" component={MemberAuth}/> 
                    <Route path="/shop/:shopid" component={Shop}/>
                    <Route exact path="/dashboard/setting" render={()=><Dashboard />}/>
                    <Route path="/dashboard" render={()=><Dashboard asyncShopListFromFirebase={this.asyncShopListFromFirebase} />}/>
                    <Route path="/">
                        <Redirect to="/dashboard"/>
                    </Route>
                </Switch>
            </Router>
        )
    }
    /** functions below handle shoplist */
    /** this func aysc shopList from firebase to redux store */
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
}

function mapStateToProps({auth, shopList},ownProps){
    return {
        auth,
        shopList,
    };
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

export default connect(mapStateToProps,mapDispatchToProps)(AfterSignIned);
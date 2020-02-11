import React,{ Component } from "react";
import {connect} from "react-redux";

class Order extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return <div> Order key in </div>
    }
}

export default connect()(Order);
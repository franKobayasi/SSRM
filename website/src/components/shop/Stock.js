import React,{ Component } from "react";
import {connect} from "react-redux";

class Stock extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return <div> Stock key in </div>
    }
}

export default connect()(Stock);


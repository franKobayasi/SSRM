import React,{ Component } from "react";
import {connect} from "react-redux";

class Purchase extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return <div> Purchase key in </div>
    }
}

export default connect()(Purchase);
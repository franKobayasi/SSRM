import React,{Component,Fragment} from "react";

function Toggle(props) {
    let isOn=props.isOn;
    let toggle=props.toggle;
    return (
        <span onClick={toggle} className={isOn?"app-toggle-active":"app-toggle"}>
            <div className="app-toggle-ball"></div>
        </span>
    )
}

export default Toggle;
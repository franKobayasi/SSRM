import React,{Component,Fragment} from "react";

function Toggle(props) {
    let isOn=props.isOn;
    let toggle=props.toggle;
    return (
        <span onClick={toggle} className={`app-toggle${isOn?'-active':''}`}>
            <div className="app-toggle-ball"></div>
        </span>
    )
}
function ToggleCol(props) {
    let isOn=props.isOn;
    let toggle=props.toggle;
    return (
        <span onClick={toggle} className={`app-toggle--Col${isOn?'-active':''}`}>
            <div className="app-toggle-ball"></div>
        </span>
    )
}

export {Toggle, ToggleCol};
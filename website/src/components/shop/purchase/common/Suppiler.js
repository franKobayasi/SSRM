import React,{ Component,Fragment } from 'react';

export default function Supplier(props){
    return (
        <Fragment>
            <span className="title">供應商：</span>
            <span className="SupplierDetail">{props.title}</span>
            <span className="title">商家電話：</span>
            <span className="SupplierAddress">{props.phone}</span>
            <span className="title">商家地址：</span>
            <span className="SupplierAddress">{props.address}</span>
        </Fragment>
    )
}
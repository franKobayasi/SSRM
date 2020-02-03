import React,{Component,Fragment} from "react";
import bgImg_memberLogin from "../../img/BgImage_member_login_page.jpg";

const ShopPage=(props)=>{
    console.log(props);
    return (
        <Fragment>
            <div id="shop-login-panel">
            <div className="shopLogo">
                {props.shopMainPic?<img class="shop-main-pic" src={props.shopMainPic} />:props.title}
            </div>
            <span>歡迎，{props.title}</span><br/>
            <input type="text" placeholder="輸入使用者名稱"/><br/>
            <input type="password" placeholder="輸入密碼"/><br/>
            <input type="button" value="忘記密碼"/>
            <input type="button" value="登入"/>
            </div>
        </Fragment>
    )
}

export default ShopPage;
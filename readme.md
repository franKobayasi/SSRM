<img src="https://i.imgur.com/tDAl8oW.png  " width=30px/> SSRM 簡單店家

簡單店家是一款為服飾商家設計的輕型ERP管理系統，簡化店家從商品採購、進貨、退貨至商品銷售等環節之資料處理。

website: https://ssrm-e7bc3.web.app/
version: 1.0 
update date: 2020-03-13

### Table of Content


### Technologies
* HTML, CSS, JavaScript
* React for JS
* React Router
* Redux
* SCSS for CSS
* Firebase Hosting
* Firebase Functions
* Firebase Authencation
* Firebase Cloud Firebase
* Facebook Login

### Features
#### Tutorial
* show tutorial for first time landing on landing page
* tutorial btn for review tutorial
* shop initial setting

![](https://i.imgur.com/SF5DSXy.png)

![](https://i.imgur.com/OUVYusv.png)

#### Purchase operation
* Supplier data entry 
* Purchased products data entry
* Goods information including name, cost, price, size, color and pieces 

![](https://i.imgur.com/t7fkQa6.png)

![](https://i.imgur.com/G6XLRvA.png)

![](https://i.imgur.com/uGr19Fn.png)

#### Stockin & Return operation
* According Purchase entry data to conduct stockin operation
* Synchronously updating stock of goods when stockin and return operation
* Purchase order search

![](https://i.imgur.com/JgYBKpY.png)

#### Checkout operation
* Record saled goods' info and updata cusotmer shopping history.
* Record all chekcout Records.
* Create/Modify/Delete/Search checkout history.

![](https://i.imgur.com/RpwwyK2.png)

![](https://i.imgur.com/snlSnLx.png)

### React and Redux Structure

* React Structure
* * App
---- AfterSignIn<br\>
------ Dashboard<br\>
------ Purchase_Create<br\>
------ Purchase_Detail<br\>
------ Purchase_History<br\>
------ StockIn<br\>
------ StockReturn<br\>
------ StockHistory<br\>
------ Checkout_Create<br\>
------ Checkout_Detail<br\>
------ Checkout_History<br\>
---- BeforeSignIn<br\>
------ Auth<br\>
-------- SignIn<br\>
-------- SignUp<br\>
* Redux State
-- State<br\>
---- state<br\>
------isFetch<br\>
------isError<br\>
---- shop<br\>
------status<br\>
------title<br\>
------address<br\>
------tel<br\>
------onCheckoutMode<br\>
------time<br\>
---- auth<br\>
------MEMBER_UID<br\>
------MEMBER_NAME<br\>
------MEMBER_EMAIL<br\>
------isLogin<br\>

### Contact

email: alinktofrank@gmail.com

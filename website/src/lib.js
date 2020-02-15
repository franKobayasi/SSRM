/** 亂數產生 */
function randomusefloor(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
// 亂數英文字
function makerandomletter(max){
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
  for (var i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
// 前兩碼英文小寫,後5碼數字
function randomPurchaseOrderID(){
    let date=new Date();
    let year=`${date.getFullYear()}`.toUpperCase();
    let month=(parseInt(date.getMonth(),10)+1)>=10?`${parseInt(date.getMonth(),10)+1}`:`0${parseInt(date.getMonth(),10)+1}`;
    return `P${year}${month}${makerandomletter(2)}${randomusefloor(1,99999)}`;
}
function randomCheckOutOrderID(){
    let date=new Date();
    let year=`${date.getFullYear()}`.toUpperCase();
    let month=(parseInt(date.getMonth(),10)+1)>=10?`${parseInt(date.getMonth(),10)+1}`:`0${parseInt(date.getMonth(),10)+1}`;
    return `C${year}${month}${makerandomletter(2)}${randomusefloor(1,99999)}`;
}
function randomStockOrderID(){
    let date=new Date();
    let year=`${date.getFullYear()}`.toUpperCase();
    let month=(parseInt(date.getMonth(),10)+1)>=10?`${parseInt(date.getMonth(),10)+1}`:`0${parseInt(date.getMonth(),10)+1}`;
    return `S${year}${month}${makerandomletter(2)}${randomusefloor(1,99999)}`;
}
function randomProductID(){
    let date=new Date();
    let year=`${date.getFullYear()}`.toUpperCase();
    let month=(parseInt(date.getMonth(),10)+1)>=10?`${parseInt(date.getMonth(),10)+1}`:`0${parseInt(date.getMonth(),10)+1}`;
    return `I${year}${month}${makerandomletter(3)}${randomusefloor(1,9999)}`;
}

/** Math round 取整數 */
function roundAfterPointAt(value,target){ 
  return Math.round(value*Math.pow(10,target))/Math.pow(10,target)
}

/** ajax */
function ajax(method, src, args, headers, callback){
	let req=new XMLHttpRequest();
	if(method.toLowerCase()==="post"){ // post through json args
		req.open(method, src);
		req.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
		setRequestHeaders(req, headers);
		req.onload=function(){
			callback(this);
		};
		req.send(JSON.stringify(args));
	}else{ // get through http args
		req.open(method, src+"?"+args);
		setRequestHeaders(req, headers);
		req.onload=function(){
			callback(this);
		};
		req.send();
	}
};
function setRequestHeaders(req, headers){
  for(let key in headers){
    req.setRequestHeader(key, headers[key]);
  }
}

export {randomProductID, randomPurchaseOrderID, randomCheckOutOrderID, randomStockOrderID, roundAfterPointAt, ajax};
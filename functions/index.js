const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});


// var serviceAccount = require("C:\\Users\\rebor\\Desktop\\SSRMservice-account-file.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://ssrm-e7bc3.firebaseio.com"
// });

const app=admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ssrm-e7bc3.firebaseio.com'
});
const DB = app.firestore();

/** shop auth  */
exports.shopAuth=functions.https.onRequest(async(req,res)=>{
  cors(req, res, async()=>{
    if(req.method==="POST"){
      let body=req.body;
      let userClient=body.user;
      let resBody;
      // await DB.ref(`members/${body.uid}/shops/${body.shopID}/users`).get()
      await DB.collection('members').doc(body.uid).collection('shops').doc(body.shopID).collection('users').get()
      .then(snapshot=>{
        console.log(body);
        if(snapshot.empty){
          console.log('No matching documents.');
          resBody={
            state:'fail',
            message:'NO_USER_EXIST'
          }
        }else{
          let users=[];
          snapshot.forEach(doc=>{
            let user=doc.data();
            user.id=doc.id;
            users.push(user);
          })
          for(let temp of users){
            if(userClient.type==='owner'){
              if(temp.type==='owner'&&temp.password===userClient.password){
                resBody={
                  state:'success',
                  userID:temp.id,
                  type:temp.type
                }
                console.log('owner login')
                // owner login;
              }else{
                resBody={
                  state:'fail',
                  message:'owner login fail: wrong name or password'
                }
                // owner login fail 
              }
            }else{
              if(temp.name===userClient.name&&temp.password===userClient.password){
                resBody={
                  state:'success',
                  userID:temp.id,
                  type:temp.type
                }
                console.log('owner login')
                // employee login;
              }else{
                resBody={
                  state:'fail',
                  message:'employee login fail: wrong name or password'
                }
                console.log('employee login fail: wrong name or password')
                // employee login fail
              }
            }
          }       
        }
        res.send(resBody);
        return;
      })
      .catch(error=>{
        console.log('firebase error');
        resBody={
          state:'error',
          message:'FIREBASE_ERROR'
        }
        res.send(resBody);
        return;
      })
    }else{
      console.log('type error');
      resBody={
        state:'error',
        message:'error ajax method, please use post'
      }
      res.send(resBody);
    }
  })
})

/** add new supplier */
exports.addNewSupplier=functions.https.onRequest(async(req,res)=>{
  // 跨域請求
  cors(req, res, async()=>{
    // 收到供應商資料並確認是否有重複，如果沒有則新增成功
    if(req.method==="POST"){
      let data=req.body;
      let supplier=data.supplier;
      let isExist=false;
      let resData;
      try{
        await DB.collection('members').doc(data.uid).collection('shops').doc(data.shopID).collection('provider')
        .where('phone','==',`${supplier.phone}`).get()
        .then(snapshot=>{
          if(snapshot.empty){
            console.log('確定無重複供應商，可以執行添加');
            resData={
              state:'succsee',
              message:'新增成功'
            }
          }else{
            snapshot.forEach(doc=>{
              supplier.id=doc.id;
            })
            isExist=true;
            resData={
              state:'fail',
              message:'供應商已經存在，新增失敗',
              supplier:supplier
            }
          }
          return ;
        })
        .catch((error)=>{
          console.error('Error\n在新增供應商過程，查詢供應商發生錯誤')
          console.log(error);
          resData={
            state:'error',
            message:'在新增供應商過程，查詢供應商發生錯誤'
          }
          return ;
        })
      }
      catch(error){
        console.log("call firestore DB error");
        console.log(error)
        resData={
          state:'error',
          message:'在新增供應商過程，查詢供應商發生錯誤'
        }
      }
      if(!isExist){
        await DB.collection('members').doc(data.uid).collection('shops').doc(data.shopID).collection('provider').add(supplier)
          .then(docRef=>{
            console.log('供應商註冊中...')
            supplier.id=docRef.id
            resData.supplier=supplier;      
            return ;
          })
          .catch(error=>{
            console.error('Error\n在新增供應商過程，新增供應商發生錯誤')
            console.log(error);
            resData={
              state:'error',
              message:'在新增供應商過程，新增供應商發生錯誤'
            }
            return ;
          })   
      }
      res.status(200).send(resBody);
    }else{
      console.error('ERROR\nclient request type error');
      resBody={
        state:'Error',
        message:'wrong request method, this api need to use post'
      }
      res.status(404).send(resBody);
    }
  })
})
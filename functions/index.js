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
exports.modifyMasterKey=functions.https.onRequest(async(req,res)=>{
  cors(req, res, async()=>{
    let resBody;
    if(req.method==="POST"){
      let body=req.body;
      let shop;
      await DB.collection('shops').doc(body.uid).get()
      .then(doc=>{
        if(!doc.exists){
          console.log('No matching documents.');
          resBody={
            status:'fail',
            message:'wrong shop infomation, this shop is not set up yet.'
          }
        }else{
          shop=doc.data();
        }
        return;
      })
      .catch(error=>{
        resBody={
          status:'error',
          message:'FIREBASE_ERROR\nupdate MasterKey fail'
        }
        return;
      })
      if(shop){        
        if(body.old_MK&&body.old_MK===shop.masterKey){
          if(body.new_MK&&body.new_MK.length>=4||/[A-z]+\d+\w+/.test(body.new_MK)){
            await DB.collection('shops').doc(body.uid).update({
              masterKey:body.new_MK
            })
            .then(res=>{
              resBody={
                status:'success',
                message:'權限密碼更新成功！'
              }
              return ;
            })
            .catch(error=>{
              resBody={
                status:'error',
                message:'FIREBASE_ERROR\nupdate MasterKey fail'
              }
              console.error('權限密碼更新失敗！firebase error');
              console.log(error);
              return;
            })
          }else{
            resBody={
              status:'fail',
              message:'新的權限密碼不符合格式要求，無法更改，請再次輸入'
            }
          }
        }else{
          resBody={
            status:'fail',
            message:'原始權限密碼輸入錯誤，無法更改，如果忘記權限密碼，請於側邊導航欄位點擊重設權限密碼，重設的連結會寄至您所設定的信箱'
          }
        }
      }
    }else{
      resBody={
        status:'error',
        message:'error ajax method, please use post'
      }
    }
    res.send(resBody);
  })
})

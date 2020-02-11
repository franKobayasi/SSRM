const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});


const app=admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ssrm-e7bc3.firebaseio.com'
});
const DB = app.firestore();

/** shop auth  */
exports.post=functions.https.onRequest((req, res)=>{
  let body=req.body
  console.log(body);
  res.status(200).send(`${body.name}'s password is ${body.password}`);
});

exports.get=functions.https.onRequest((req, res)=>{
  let query=req.query;
  console.log(query);
  res.status(200).send(`the query: ${query}`);
});

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
        type:'error',
        message:'error ajax method, please use post'
      }
      res.send(resBody);
    }
  })
})
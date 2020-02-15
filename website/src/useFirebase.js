import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {createHashHistory as history} from 'history';
/** action creator */
import {actionSignIn,actionSignOut,actionAuthError} from "./actions/auth";
import {actionFetchPosted,actionFetchSuccessed,actionFetchFailed} from "./actions/fetch";

/** firebase setting */
const firebaseConfig={
    apiKey: "AIzaSyB_-E52vJyT4ujSJTny-8gVY-SFKQul8tU",
    authDomain: "ssrm-e7bc3.firebaseapp.com",
    databaseURL: "https://ssrm-e7bc3.firebaseio.com",
    projectId: "ssrm-e7bc3",
    storageBucket: "ssrm-e7bc3.appspot.com",
    messagingSenderId: "153008677321",
    appId: "1:153008677321:web:d81c5d3731c6ab90aa0818",
    measurementId: "G-MS2Z2RBSX1"
};
const ssrmFirebase=firebase.initializeApp(firebaseConfig);
/** customize own firebase instance */
ssrmFirebase.auth().useDeviceLanguage();
/** for facebook login */
const fbAuthProvider = new firebase.auth.FacebookAuthProvider();
fbAuthProvider.addScope('public_profile,email');
/** DataBase */
const ssrmDB=ssrmFirebase.firestore()

/** customize function to get data from firebase with auto dispatch and console log error  */
function getDataFromFireBase({type,prefix,name},callback,dispatch){
    let targetData
    if(type==='doc'){ /** if target type is doc, prefix is collection and name is doc's */
        targetData=prefix.doc(name).get();
    }else if(type==='collection'){
        targetData=prefix.collection(name).get();
    }else{
        console.error('ERROR\nWrong firebase data type, only accept doc or collection');
    }
    dispatch(actionFetchPosted()); /** start fetching */
    targetData
    .then(data=>{
        dispatch(actionFetchSuccessed());
        if(data.exists){
            callback(data);
        }else{
            console.log(`can\'t find any document named ${docName} in collection ${collectionName}`);
        }
    })
    .catch(error=>{
        dispatch(actionFetchFailed());
        console.error(`Error: get data from firebase fail\n func:getDataFromFireBase`);
        console.log(`During get data from document named ${docName} in collection ${collectionName}`);
        console.log(error);
    })
}
/** check login state when first time landing  */
function getAuthState(dispatch){
    try{
        ssrmFirebase.auth().onAuthStateChanged(function(user){
            if(user){
                try{
                    dispatch(actionSignIn(user));
                    console.log('auto login!');
                }catch(error){
                    console.error('ERROR\nUser infomation lost')
                    console.log(error);
                    dispatch(actionSignOut());
                }
            }else{
                console.log('not yet logined!');
                dispatch(actionSignOut());
            }
        });
    }
    catch(error){
        console.error('ERROR\nFirebase server get user auth fail');
        console.log(error);
        dispatch(actionAuthError()); /** 優化：設計一個當前因伺服器問題無訪法登入的頁面 */
    }
}

export {fbAuthProvider,ssrmDB,getDataFromFireBase,getAuthState};
export default ssrmFirebase;
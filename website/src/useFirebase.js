import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

export const ssrmDB=ssrmFirebase.firestore();
export default ssrmFirebase;
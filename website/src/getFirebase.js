import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

export const ssrmFirebase=firebase.initializeApp(firebaseConfig);
export const DB=ssrmFirebase.firestore();

/*
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});

var user = firebase.auth().currentUser;

if (user) {
  // User is signed in.
} else {
  // No user is signed in.
}
*/
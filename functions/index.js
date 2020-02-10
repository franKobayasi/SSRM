const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


// const app=admin.initializeApp();
const app=admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ssrm-e7bc3.firebaseio.com'
});
const Auth = app.auth();
const DB = app.database();




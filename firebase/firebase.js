// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgos-BAzPcEhkM1rL-t1rvfpyYNPfTlmc",
  authDomain: "theorganizer-504c7.firebaseapp.com",
  projectId: "theorganizer-504c7",
  storageBucket: "theorganizer-504c7.appspot.com",
  messagingSenderId: "568482043731",
  appId: "1:568482043731:web:7a10bfc6b422f2e7c773a6"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = getFirestore(app);

export { auth, db };
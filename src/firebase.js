import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

let config = {
  apiKey: "AIzaSyCuMclYf2KfGsi3NWbZ2ObQ2mAQOro2aik",
  authDomain: "demo.firebaseapp.com",
  databaseURL: "https://fir-32b8f.firebaseio.com",
  projectId: "fir-32b8f"
};
firebase.initializeApp(config);

const db = firebase.firestore();
export default db;

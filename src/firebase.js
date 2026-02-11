import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCg_lNU5t-ALd4WhZFNCQR9LN0mIPM4Ths",
  authDomain: "online-exam-portal-c49ff.firebaseapp.com",
  projectId: "online-exam-portal-c49ff",
  storageBucket: "online-exam-portal-c49ff.firebasestorage.app",
  messagingSenderId: "882120977970",
  appId: "1:882120977970:web:fd0d669d4b45edb732162b",
  measurementId: "G-GEG32VM5PF",
  databaseURL: "https://online-exam-portal-c49ff-default-rtdb.firebaseio.com/"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage=getStorage(app);

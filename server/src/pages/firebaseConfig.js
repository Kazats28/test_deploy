import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB-1eQIifwBOTsp_ck7ffCFli6mxH6VDdM",
    authDomain: "trailer-d5892.firebaseapp.com",
    projectId: "trailer-d5892",
    storageBucket: "trailer-d5892.appspot.com",
    messagingSenderId: "1037471022316",
    appId: "1:1037471022316:web:2e5d6eb707cf90cf6b79c9",
    measurementId: "G-LXCSR68J13"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
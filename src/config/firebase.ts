// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkrdN1UQVla7M4ognpwNKT7Ul1YEcCZCM",
    authDomain: "tokotitoh-cd962.firebaseapp.com",
    projectId: "tokotitoh-cd962",
    storageBucket: "tokotitoh-cd962.appspot.com",
    messagingSenderId: "480874086535",
    appId: "1:480874086535:web:f584c359eb809cc5223822",
    measurementId: "G-B4GKVBEK7J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }
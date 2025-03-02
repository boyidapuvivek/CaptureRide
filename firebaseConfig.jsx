// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import firebaseConfig from './firebaseConfig';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa3FYdlGfQrN5JvKHjntXhzW3Yc0Kr2MQ",
  authDomain: "captureride-9a46b.firebaseapp.com",
  projectId: "captureride-9a46b",
  storageBucket: "captureride-9a46b.firebasestorage.app",
  messagingSenderId: "648365797853",
  appId: "1:648365797853:web:3b081e76fe6b275ae40634",
  measurementId: "G-WPW9FGSD1L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

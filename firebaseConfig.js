import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCDL_bRfY1CKh1WJEefKGkB7LJ-20vkxMQ",
    authDomain: "mymovieapp-16ee2.firebaseapp.com",
    projectId: "mymovieapp-16ee2",
    storageBucket: "mymovieapp-16ee2.appspot.com",
    messagingSenderId: "518643351719",
    appId: "1:518643351719:web:0db8486e335340eb00db82"
  };

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  const db = getFirestore(app);

export { app, auth, db };

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyClZ2fQkMAmRoRoFlNECCBnCzeGFUX2nVg',
  authDomain: 'house-market-app-4d418.firebaseapp.com',
  projectId: 'house-market-app-4d418',
  storageBucket: 'house-market-app-4d418.appspot.com',
  messagingSenderId: '972606920052',
  appId: '1:972606920052:web:a17cc98f67308739198821',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

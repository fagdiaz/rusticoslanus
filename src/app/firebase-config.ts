import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = 
{  apiKey: "AIzaSyC9uk6RPuERTLj9HCXUToCOmhIfjkqS3ok",
  authDomain: "rusticoslanus-84470.firebaseapp.com",
  projectId: "rusticoslanus-84470",
  storageBucket: "rusticoslanus-84470.appspot.com",
  messagingSenderId: "261854181198",
  appId: "1:261854181198:web:4a0405bf75420df955901f"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);

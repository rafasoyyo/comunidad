// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// import {getDatabase} from 'firebase/database';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getRemoteConfig} from 'firebase/remote-config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDZ5V4FyriSZkC8nZhpv2B_pNSMa4uyvAA',
    authDomain: 'comunidad-2022.firebaseapp.com',
    databaseURL: 'https://comunidad-2022-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'comunidad-2022',
    storageBucket: 'comunidad-2022.appspot.com',
    messagingSenderId: '1048028132058',
    appId: '1:1048028132058:web:43bfab4ee9dacd2b74ebe3',
    measurementId: 'G-5VL0Q27RVE'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const database = getDatabase(app);
const store = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const remoteConfig = getRemoteConfig(app);
// remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

export {app, auth, store, storage, remoteConfig};

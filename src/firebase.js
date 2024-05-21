import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDX-c0EEp8VhBYRK6XupIYqS7HdPDAgj3w",
    authDomain: "w3g-project-f86e4.firebaseapp.com",
    projectId: "w3g-project-f86e4",
    storageBucket: "w3g-project-f86e4.appspot.com",
    messagingSenderId: "105585748841",
    appId: "1:105585748841:web:8a1b4e27d6d5167704ebf8",
    measurementId: "G-J44EQJG4SH"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;

// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: "AIzaSyDX-c0EEp8VhBYRK6XupIYqS7HdPDAgj3w",
//     authDomain: "w3g-project-f86e4.firebaseapp.com",
//     projectId: "w3g-project-f86e4",
//     storageBucket: "w3g-project-f86e4.appspot.com",
//     messagingSenderId: "105585748841",
//     appId: "1:105585748841:web:8a1b4e27d6d5167704ebf8",
//     measurementId: "G-J44EQJG4SH"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// export const generateToken = async () => {
//     const permission = await Notification.requestPermission();
//     console.log(permission);

//     if(permission === 'granted') {
//         const token = await getToken(messaging, {
//             vapidKey: "BGMVDCDABrDfQsTv90g2NQXbgx-RN_u5WDcQiIoojvEZlh9wm5tGQU-8t_xC2_Z7LXD1hDtbyWubJDUqTAFqFxA",
//         })
//         console.log(token);
//     }
// }
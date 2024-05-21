// import { useEffect } from 'react';
// import { getMessaging, onMessage } from 'firebase/messaging';
// import firebaseApp from "../firebase";

// export default function FcmTokenComp() {
//   useEffect(() => {
//     const messaging = getMessaging(firebaseApp);
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Foreground push notification received:', payload);
//       // Handle notification display here
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return null;
// }

'use client'
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from '../../firebase';

const useFcmToken = () => {
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp);

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: 'BGMVDCDABrDfQsTv90g2NQXbgx-RN_u5WDcQiIoojvEZlh9wm5tGQU-8t_xC2_Z7LXD1hDtbyWubJDUqTAFqFxA', 
            });
            if (currentToken) {
              console.log(currentToken);
              setToken(currentToken);
              localStorage.setItem("fcmToken",currentToken);
              
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }
        }
      } catch (error) {
        console.log('Error retrieving token:', error);
      }
    };

    retrieveToken();
  }, []);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;

// 'use client'
// import useFcmToken from "../hooks/useFCMToken";
// import { getMessaging, onMessage } from 'firebase/messaging';
// import firebaseApp from '../../firebase';
// import { useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
                          
// export default function FcmTokenComp() {
  
//   const { token, notificationPermissionStatus } = useFcmToken();

//   useEffect(() => {
//     if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
//       if (notificationPermissionStatus === 'granted') {
//         const messaging = getMessaging(firebaseApp);

//         const unsubscribe = onMessage(messaging, (payload) => {
//           console.log('Foreground push notification received:', payload)
//           alert(payload.data.body)
//         }
//         );
//         return () => {
//           unsubscribe(); // Unsubscribe from the onMessage event on cleanup tostyfy
//         };
//       }
//     }
//   },[notificationPermissionStatus]);

//   return null; // This component is primarily for handling foreground notifications
// }

'use client'
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../../firebase';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFcmToken from './useFCMToken';

export default function FcmTokenComp() {
  const { token, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp);

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground push notification received:', payload);
          if (payload.notification) {
            toast.info(payload.notification.body);
          } else if (payload.data && payload.data.body) {
            toast.info(payload.data.body);
          } else {
            toast.info('Foreground push notification received');
          }
        });

        return () => {
          unsubscribe(); // Unsubscribe from the onMessage event on cleanup
        };
      }
    }
  }, [notificationPermissionStatus]);

  return (
    <>
      <ToastContainer />
    </>
  ); 
}

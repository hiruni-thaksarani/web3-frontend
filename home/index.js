// "use client";
// import { useEffect, useState } from "react";
// import { getToken, onMessage, isSupported } from "firebase/messaging";
// import { messaging } from "../firebase";

// const useFcmToken = () => {
//   const [token, setToken] = useState("");
//   const [notificationPermissionStatus, setNotificationPermissionStatus] =
//     useState("");

//   const [notification, setNotification] = useState(null);
//   useEffect(() => {
//     const retrieveToken = async () => {
//       if (!messaging) {
//         console.log("Firebase messaging is not supported in this environment.");
//         return;
//       }
//       try {
//         if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//           // Request notification permission
//           const permission = await Notification.requestPermission();
//           setNotificationPermissionStatus(permission);
//           if (permission === "granted") {
//             const currentToken = await getToken(messaging, {
//               vapidKey:
//                 "BGMVDCDABrDfQsTv90g2NQXbgx-RN_u5WDcQiIoojvEZlh9wm5tGQU-8t_xC2_Z7LXD1hDtbyWubJDUqTAFqFxA",
//               serviceWorkerRegistration: await navigator.serviceWorker.ready,
//             });
//             if (currentToken) {
//                 console.log("token....."+currentToken);
//               setToken(currentToken);
//               // Send the token to your server
//               await fetch("/api/save-token", {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ token: currentToken }),
//               });
//             } else {
//               console.log(
//                 "No registration token available. Request permission to generate one."
//               );
//             }
//           }
//         }
//       } catch (error) {
//         console.log("Error retrieving token:", error);
//       }
//     };
//     if (typeof window !== "undefined" && isSupported()) {
//       retrieveToken();
//       // Handle foreground messages
//       onMessage(messaging, (payload) => {
//         console.log("Message received. ", payload);
//         setNotification(payload.notification);
//       });
//     }
//   }, []);
//   return { token, notificationPermissionStatus, notification };
// };
// export default useFcmToken;
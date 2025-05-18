importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAGM1pAP4At1pYH0ruILmQstUXdC9BI6DE",
    authDomain: "pkl-absensi-c2521.firebaseapp.com",
    projectId: "pkl-absensi-c2521",
    storageBucket: "pkl-absensi-c2521.firebasestorage.app",
    messagingSenderId: "619669188186",
    appId: "1:619669188186:web:1c54365acc0028b656b263",
    measurementId: "G-ZGK6J5CBBT",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
    const { title, body, image } = payload.data;

    const notificationOptions = {
        body: body,
        icon: image || "/favicon/base_icon.png",
    };

    if (Notification.permission === "granted") {
        self.registration.showNotification(title, notificationOptions);
    }
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const targetUrl = event.notification?.data?.url || "/";

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                for (let client of clientList) {
                    if (client.url === targetUrl && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});

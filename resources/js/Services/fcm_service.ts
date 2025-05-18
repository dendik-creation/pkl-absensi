import { initializeApp, FirebaseApp } from "firebase/app";
import {
    getMessaging,
    getToken,
    onMessage,
    Messaging,
    MessagePayload,
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGM1pAP4At1pYH0ruILmQstUXdC9BI6DE",
    authDomain: "pkl-absensi-c2521.firebaseapp.com",
    projectId: "pkl-absensi-c2521",
    storageBucket: "pkl-absensi-c2521.firebasestorage.app",
    messagingSenderId: "619669188186",
    appId: "1:619669188186:web:1c54365acc0028b656b263",
    measurementId: "G-ZGK6J5CBBT",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const messaging: Messaging = getMessaging(app);

interface NotificationData {
    title?: string;
    body?: string;
    image?: string;
}

// Handle foreground message
onMessage(messaging, (payload: MessagePayload) => {
    if (document.visibilityState !== "visible") return;

    const { title, body, image } = payload.data as NotificationData;

    const notificationOptions: NotificationOptions = {
        body: body,
        icon: image || "/assets/img/favicon.png",
    };

    if (Notification.permission === "granted") {
        new Notification(title ?? "Notification", notificationOptions);
    }
});

// Request permission & retrieve token
export async function requestPermissionAndToken(
    from: "supervisor" | "student"
): Promise<void> {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        try {
            const currentToken = await getToken(messaging, {
                vapidKey:
                    "BNYCEgahZuknxn-zYjP9eiCq3LDwlNzjjqZwfgfzvRTsiYV8Me2ECHqyFWe3aAN1TelFOjFpoxZFcyHDeefTWd4",
            });
            if (currentToken) {
                if (from === "supervisor") await updateFCMToken(currentToken);
                if (from === "student") await studentSubscribeReminder();
            } else {
                console.warn("No FCM token retrieved");
            }
        } catch (err) {
            console.error("Error retrieving FCM token:", err);
        }
    } else {
        console.warn("Notification permission not granted");
    }
}

async function updateFCMToken(token: string): Promise<void> {
    const csrfToken = (
        document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
    )?.content;
    await fetch("/firebase/update-fcm-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken ?? "",
        },
        body: JSON.stringify({ fcm_token: token }),
    });
}

async function studentSubscribeReminder(): Promise<void> {
    const csrfToken = (
        document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
    )?.content;
    await fetch("/firebase/student-subscribe-reminder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken ?? "",
        },
    });
}

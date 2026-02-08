import * as admin from "firebase-admin";

// Lazy initialization - only initialize when actually needed at runtime
function getAdminApp() {
    if (!admin.apps.length) {
        const firebaseAdminConfig = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Replace literal search for \n with actual newline character for PEM key
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        };

        admin.initializeApp({
            credential: admin.credential.cert(firebaseAdminConfig),
        });
    }
    return admin.app();
}

// Export getter functions for lazy initialization
export function getAdminAuth() {
    return getAdminApp().auth() as admin.auth.Auth;
}

export function getAdminDb() {
    return getAdminApp().firestore() as admin.firestore.Firestore;
}

export { admin };

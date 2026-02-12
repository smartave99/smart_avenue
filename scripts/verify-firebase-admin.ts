
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import * as admin from 'firebase-admin';

async function verify() {
    console.log("Checking environment variables...");
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId) console.error("Missing FIREBASE_PROJECT_ID");
    if (!clientEmail) console.error("Missing FIREBASE_CLIENT_EMAIL");
    if (!privateKey) console.error("Missing FIREBASE_PRIVATE_KEY");

    if (!projectId || !clientEmail || !privateKey) {
        console.error("Environment check failed.");
        return;
    }

    console.log("Environment variables present.");
    console.log(`Project ID: ${projectId}`);
    console.log(`Client Email: ${clientEmail}`);
    // console.log(`Private Key Length: ${privateKey.length}`);

    try {
        console.log("Initializing Firebase Admin...");
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: formattedKey,
                }),
            });
        }
        
        console.log("Firebase Admin initialized.");
        const db = admin.firestore();
        console.log("Attempting to connect to Firestore...");
        
        const docRef = db.collection('site_config').doc('main');
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            console.log("Document 'site_config/main' exists.");
            console.log("Data:", JSON.stringify(docSnap.data(), null, 2));
        } else {
            console.log("Document 'site_config/main' does NOT exist.");
        }
        
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verify();

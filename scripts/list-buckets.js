const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function listBuckets() {
    console.log('Listing all Google Cloud Storage buckets...');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

    if (!projectId || !clientEmail || !privateKey) {
        console.error('Missing environment variables.');
        return;
    }

    try {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        }

        // Access the underlying GCS client
        // The firebase-admin storage() returns a service that wraps GCS.
        // We can get the GCS client via the bucket.
        const bucket = admin.storage().bucket('dummy-bucket');
        const storage = bucket.storage;

        try {
            const [buckets] = await storage.getBuckets();
            console.log('Successfully listed buckets:');
            if (buckets.length === 0) {
                console.log('No buckets found in this project.');
            } else {
                buckets.forEach(b => console.log(`- ${b.name}`));
            }
        } catch (err) {
            console.error('Failed to list buckets:', err.message);
        }

    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

listBuckets();

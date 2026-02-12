const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyStorage() {
    console.log('Verifying Firebase Storage...');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Handle private key newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    console.log(`Project ID: ${projectId}`);
    console.log(`Client Email: ${clientEmail}`);
    console.log(`Configured Bucket: ${storageBucket}`);

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
                storageBucket: storageBucket,
            });
        }

        const bucketName = storageBucket;
        const bucket = admin.storage().bucket(bucketName); // Explicitly pass name just in case
        console.log(`Attempting to list files in bucket: ${bucket.name}`);

        try {
            const [files] = await bucket.getFiles({ maxResults: 1 });
            console.log('Successfully listed files!');
            console.log(`Found ${files.length} file(s).`);
        } catch (error) {
            console.error(`Failed to list files in ${bucket.name}:`);
            console.error(error.message);

            if (error.code === 404 || error.message.includes('not exist')) {
                console.log('\n--- Trying alternative bucket names ---');
                const alternatives = [
                    `${projectId}.appspot.com`,
                    `staging.${projectId}.appspot.com`,
                    `${projectId}.firebasestorage.app` // Already tried, but good to keep
                ];

                for (const altName of alternatives) {
                    if (altName === bucket.name) continue;

                    console.log(`Testing bucket: ${altName}`);
                    const altBucket = admin.storage().bucket(altName);
                    try {
                        const [files] = await altBucket.getFiles({ maxResults: 1 });
                        console.log(`SUCCESS! Bucket '${altName}' exists and is accessible.`);
                        console.log(`Found ${files.length} file(s).`);
                    } catch (altError) {
                        console.log(`Failed to access ${altName}: ${altError.message}`);
                    }
                }
            }
        }

    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

verifyStorage();

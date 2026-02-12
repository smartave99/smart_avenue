import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyStorage() {
    console.log('Verifying Firebase Storage...');

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    console.log(`Project ID: ${projectId}`);
    console.log(`Client Email: ${clientEmail}`);
    console.log(`Configured Bucket: ${storageBucket}`);

    if (!projectId || !clientEmail || !privateKey) {
        console.error('Missing environment variables.');
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
            storageBucket: storageBucket,
        });

        const bucket = admin.storage().bucket();
        console.log(`Attempting to list files in bucket: ${bucket.name}`);

        try {
            const [files] = await bucket.getFiles({ maxResults: 1 });
            console.log('Successfully listed files!');
            console.log(`Found ${files.length} file(s).`);
        } catch (error: any) {
            console.error(`Failed to list files in ${bucket.name}:`);
            console.error(error.message);

            if (error.code === 404) {
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
                        await altBucket.getFiles({ maxResults: 1 });
                        console.log(`SUCCESS! Bucket '${altName}' exists and is accessible.`);
                    } catch (altError: any) {
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

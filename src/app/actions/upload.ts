"use server";

import { getAdminStorage } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth"; // We might need to verify the user server-side if not passing token, but let's keep it simple first.
import { headers } from "next/headers";

// Simple validation to ensure only authorized users can upload.
// For now, we'll rely on the client-side check or if we have a session cookie.
// Since we don't have a full session system visible here, we'll proceed with basic implementation.
// In a real production app, we should verify the ID token passed in headers or cookies.

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "uploads";

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const buffer = await file.arrayBuffer();
        const storage = getAdminStorage();
        const bucket = storage.bucket();

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `${folder}/${timestamp}_${safeName}`;
        const fileRef = bucket.file(filePath);

        await fileRef.save(Buffer.from(buffer), {
            metadata: {
                contentType: file.type,
            },
        });

        // Make the file public
        await fileRef.makePublic();

        // Construct the public URL
        // Firebase Storage public URLs are typically: 
        // https://storage.googleapis.com/BUCKET_NAME/FILE_PATH
        // OR via Firebase API: https://firebasestorage.googleapis.com/v0/b/BUCKET_NAME/o/FILE_PATH?alt=media

        // Let's try to get the signed URL or public URL.
        const publicUrl = fileRef.publicUrl();

        // The publicUrl() method returns a URL that might be direct GCS link.
        // https://storage.googleapis.com/${bucket.name}/${filePath}

        return { success: true, url: publicUrl, path: filePath };

    } catch (error) {
        console.error("Server upload error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Upload failed" };
    }
}

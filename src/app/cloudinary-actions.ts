"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
    fileUri: string,
    folder: string,
    resourceType: "image" | "video" | "raw" | "auto" = "image"
) {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Missing Cloudinary configuration. Please check server environment variables.");
        }

        const result = await cloudinary.uploader.upload(fileUri, {
            folder: `smart-avenue/${folder}`,
            resource_type: resourceType,
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown upload error",
        };
    }
}

export async function deleteFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { success: true, result };
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown delete error",
        };
    }
}

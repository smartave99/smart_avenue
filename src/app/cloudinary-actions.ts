"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinarySignature(folder: string, transformation?: string) {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Missing Cloudinary configuration");
        }

        const timestamp = Math.round(new Date().getTime() / 1000);

        const params: Record<string, string | number> = {
            timestamp,
            folder: `smart-avenue/${folder}`,
        };

        if (transformation) {
            params.transformation = transformation;
        }

        const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

        return {
            success: true,
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        };
    } catch (error) {
        console.error("Cloudinary signature error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
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

export async function uploadToCloudinary(base64Image: string, folder: string, resourceType: "image" | "video" | "raw" = "image") {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Missing Cloudinary configuration");
        }

        const result = await cloudinary.uploader.upload(base64Image, {
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


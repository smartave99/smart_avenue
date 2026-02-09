"use server";

import { getAdminDb, admin } from "@/lib/firebase-admin";

export interface ClubTier {
    id: string;
    name: string;
    description?: string;
    price: string;
    benefits: string[];
    color: string;
    recommended?: boolean;
}

export async function getClubTiers(): Promise<ClubTier[]> {
    try {
        const doc = await getAdminDb().collection("siteContent").doc("clubTiers").get();
        if (doc.exists) {
            return doc.data()?.items || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching club tiers:", error);
        return [];
    }
}

export async function updateClubTiers(tiers: ClubTier[]) {
    try {
        await getAdminDb().collection("siteContent").doc("clubTiers").set({
            items: tiers,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

"use server";

import { getAdminDb, admin } from "@/lib/firebase-admin";

export interface Subscriber {
    id: string;
    email: string;
    subscribedAt: Date;
    status: "subscribed" | "unsubscribed";
}

export async function subscribeToNewsletter(email: string) {
    try {
        const db = getAdminDb();
        const existing = await db.collection("newsletter_subscribers").where("email", "==", email).get();

        if (!existing.empty) {
            return { success: false, error: "Email already subscribed" };
        }

        await db.collection("newsletter_subscribers").add({
            email,
            status: "subscribed",
            subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getNewsletterSubscribers(): Promise<Subscriber[]> {
    try {
        const snapshot = await getAdminDb().collection("newsletter_subscribers").orderBy("subscribedAt", "desc").get();
        return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
            subscribedAt: (doc.data().subscribedAt as admin.firestore.Timestamp)?.toDate() || new Date(),
        })) as Subscriber[];
    } catch (error) {
        console.error("Error fetching newsletter subscribers:", error);
        return [];
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await getAdminDb().collection("newsletter_subscribers").doc(id).delete();
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

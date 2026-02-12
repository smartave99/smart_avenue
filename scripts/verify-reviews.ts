import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getReviews, getProducts } from '../src/app/actions';

async function verify() {
    console.log("Starting review verification...");

    const products = await getProducts(undefined, undefined, 5);
    if (products.length === 0) {
        console.error("No products found to test with.");
        return;
    }

    for (const product of products) {
        console.log(`\nChecking reviews for: ${product.name} (${product.id})`);
        console.log(`Product metadata says: ${product.reviewCount} reviews, ${product.averageRating} avg rating`);

        try {
            const reviews = await getReviews(product.id);
            console.log(`Successfully fetched ${reviews.length} reviews.`);
            if (reviews.length > 0) {
                console.log(`Sample review: ${reviews[0].userName} - "${reviews[0].comment.slice(0, 30)}..."`);
            }
        } catch (e) {
            console.error(`Failed to fetch reviews for ${product.id}:`, e);
        }
    }
}

verify().catch(console.error);

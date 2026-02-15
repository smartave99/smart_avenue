
import { SiteConfig, DEFAULT_SITE_CONFIG } from "./src/types/site-config";

// Copy the deepMerge function EXACTLY from src/app/actions/site-config.ts
function deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
        return source;
    }

    if (Array.isArray(target) || Array.isArray(source)) {
        return source; // Arrays are replaced entirely
    }

    const output = { ...target };
    Object.keys(source).forEach(key => {
        if (key in target) {
            output[key] = deepMerge(target[key], source[key]);
        } else {
            output[key] = source[key];
        }
    });
    return output;
}

function testMerge() {
    console.log("Testing Deep Merge with Social Links...");

    const userProvidedUrl = "https://www.instagram.com/smartavenue_99?utm_source=qr&igsh=MXhpZHFldXl2bjh3aA==";

    // Simulate DB data having the NEW link
    const mockDbData: Partial<SiteConfig> = {
        footer: {
            ...DEFAULT_SITE_CONFIG.footer, // simulating what might be in DB if it was a partial update or full object
            socialLinks: {
                facebook: "#",
                instagram: userProvidedUrl,
                twitter: "#",
            }
        }
    };

    // Remove things that wouldn't likely be in a partial update if we want to test "partial" nature, 
    // but updateSiteConfig does a .set() so it saves the WHOLE object.
    // However, getSiteConfig treats it as Partial<SiteConfig>.

    const merged = deepMerge(DEFAULT_SITE_CONFIG, mockDbData);

    console.log("Original Default Instagram:", DEFAULT_SITE_CONFIG.footer.socialLinks.instagram);
    console.log("DB Instagram (Input):     ", userProvidedUrl);
    console.log("Merged Instagram (Result):", merged.footer.socialLinks.instagram);

    if (merged.footer.socialLinks.instagram === userProvidedUrl) {
        console.log("[PASS] Merge logic handles the URL correctly.");
    } else {
        console.error("[FAIL] Merge logic failed to overwrite the default.");
    }

    // Double check specific nested structure persistence
    const originalNavigation = DEFAULT_SITE_CONFIG.footer.navigation.shop.links[0].name;
    const dbNavigation = "My Custom Link Name";
    const mockDbDataWithNav: Partial<SiteConfig> = {
        footer: {
            // ...DEFAULT_SITE_CONFIG.footer, 
            // NOTE: If the DB only has partial footer, verify it merges.
            // However, Firestore .data() returns the whole document object.
            navigation: {
                shop: {
                    title: "Shop",
                    links: [{ name: dbNavigation, href: "/test" }]
                },
                // @ts-ignore
                company: {} // missing company in DB update (hypothetically)
            }
        }
    };

    // Actually, in our code we cast doc.data() as Partial. 
    // Let's test a very sparse object.
    const sparseData = {
        footer: {
            socialLinks: {
                instagram: userProvidedUrl
            }
        }
    };

    console.log("\nTesting Sparse Data Merge...");
    const mergedSparse = deepMerge(DEFAULT_SITE_CONFIG, sparseData);
    console.log("Merged Sparse Instagram:", mergedSparse.footer?.socialLinks?.instagram);

    // Check if other fields are preserved
    console.log("Merged Sparse Facebook (should be default):", mergedSparse.footer.socialLinks.facebook);

    if (mergedSparse.footer.socialLinks.instagram === userProvidedUrl && mergedSparse.footer.socialLinks.facebook === DEFAULT_SITE_CONFIG.footer.socialLinks.facebook) {
        console.log("[PASS] Sparse merge works.");
    } else {
        console.log("[FAIL] Sparse merge failed.");
    }

}

testMerge();

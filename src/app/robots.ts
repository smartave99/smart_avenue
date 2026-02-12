import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/admin/", // Assuming an admin path exists or might exist
        },
        sitemap: "https://smartavenue99.com/sitemap.xml",
    };
}

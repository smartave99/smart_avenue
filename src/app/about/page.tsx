import { getSiteContent, AboutPageContent, ContactContent } from "@/app/actions";
import AboutContent from "@/components/AboutContent";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const [pageContent, contactContent] = await Promise.all([
        getSiteContent<AboutPageContent>("about-page"),
        getSiteContent<ContactContent>("contact")
    ]);

    return <AboutContent content={pageContent} contact={contactContent} />;
}

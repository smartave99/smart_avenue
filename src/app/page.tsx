import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Highlights />
    </div>
  );
}

import { Hero } from "@/components/pages/home/hero";
import { generateMetadata } from "@/config/seo";

export const metadata = generateMetadata({
  title: "Home | Fluency Checker",
  description:
    "A platform for analyzing and improving your language proficiency across multiple languages",
});

export default async function Home() {
  return (
    <main className=" mx-auto flex flex-col items-center justify-center ">
      <Hero />
    </main>
  );
}

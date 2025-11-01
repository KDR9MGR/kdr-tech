import Image from "next/image";
import Hero from "@/components/main/Hero";
import BrandScroll from "@/components/main/BrandScroll";
import Skills from "@/components/main/Skills";
import About from "@/components/main/About";
import Team from "@/components/main/Team";
import Encryption from "@/components/main/Encryption";
import Projects from "@/components/main/Projects";
import AchievementsSection from "@/components/main/AchievementsSection";
import AppLogosScroll from "@/components/main/AppLogosScroll";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="w-full max-w-[100vw] overflow-x-hidden px-0 py-10 flex flex-col gap-10">
        <Hero />
        <AchievementsSection />
        <AppLogosScroll />

        <Skills />
        <About />
        <Team />
        <Encryption />
        <Projects />
      </div>
    </main>
  );
}

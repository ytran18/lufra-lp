import HeroWrapper from "@/components/HeroWrapper";
import Features from "@/components/Features";
import Settings from "@/components/Settings";
import Support from "@/components/Support";
import CtaFooter from "@/components/CtaFooter";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col items-center pb-0">
      <div className="relative z-10 pointer-events-none w-full">
        <HeroWrapper />
      </div>
      <Features />
      <Settings />
      <Support />
      <CtaFooter />
    </main>
  );
}
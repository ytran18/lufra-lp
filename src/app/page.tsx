import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col items-center pb-24">
      <div className="relative z-10 pointer-events-none w-full">
        <Hero />
      </div>
      <Features />
    </main>
  );
}
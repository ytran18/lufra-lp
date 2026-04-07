import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative flex w-full flex-col items-center pb-24">
      <div className="relative z-10 pointer-events-none w-full">
        <Hero />
      </div>
    </main>
  );
}
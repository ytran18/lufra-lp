import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center pb-24">
      {/* 3D Canvas placeholder would go here with z-0 */}
      <div className="relative z-10 pointer-events-none w-full">
        <Hero />
      </div>
    </main>
  );
}
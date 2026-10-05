import { TEAM_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="bg-blaugrana grid min-h-dvh place-items-center px-4 py-16 text-center">
      <div className="grid gap-3">
        <p className="font-condensed text-sm font-semibold uppercase tracking-[0.18em] text-gold">Mùa giải 2026</p>
        <h1 className="font-display text-6xl uppercase sm:text-8xl">{TEAM_NAME}</h1>
        <p className="text-chalk-dim">Trang đội bóng đang được xây dựng.</p>
      </div>
    </main>
  );
}

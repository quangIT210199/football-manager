import { getWinRate, MIN_APPEARANCES_FOR_WIN_RATE, type TeamLeaders as Leaders } from "@/lib/utils/playerStats";

type TeamLeadersProps = {
  leaders: Leaders;
};

export function TeamLeaders({ leaders }: TeamLeadersProps) {
  const { topScorer, topAssister, bestWinRate } = leaders;
  const items = [
    topScorer && { label: "Vua phá lưới", value: topScorer.stats.goals, name: topScorer.full_name },
    topAssister && { label: "Kiến tạo nhiều nhất", value: topAssister.stats.assists, name: topAssister.full_name },
    bestWinRate && {
      label: `Tỉ lệ thắng cao nhất (từ ${MIN_APPEARANCES_FOR_WIN_RATE} buổi)`,
      value: `${getWinRate(bestWinRate) ?? 0}%`,
      name: bestWinRate.full_name,
    },
  ].filter((item) => item !== null);

  if (items.length === 0) return null;

  return (
    <section aria-label="Cầu thủ dẫn đầu" className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-4 border border-chalk/30 bg-black/25 px-4 py-3">
          <span className="min-w-[2ch] font-display text-4xl text-gold tabular-nums">{item.value}</span>
          <div className="min-w-0">
            <p className="font-condensed text-xs font-semibold tracking-[0.14em] text-chalk-dim uppercase">{item.label}</p>
            <p className="truncate text-lg font-semibold">{item.name}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

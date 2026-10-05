import { TEAM_NAME } from "@/lib/constants";
import type { TeamTotals } from "@/types/match";

type TeamHeaderProps = {
  totals: TeamTotals;
  playerCount: number;
};

export function TeamHeader({ totals, playerCount }: TeamHeaderProps) {
  const goalsPerSession = totals.sessions > 0 ? (totals.goals / totals.sessions).toFixed(1) : "–";
  const board = [
    { label: "Buổi đá", value: totals.sessions },
    { label: "Cầu thủ", value: playerCount },
    { label: "Tổng bàn", value: totals.goals },
    { label: "Bàn / buổi", value: goalsPerSession },
  ];

  return (
    <header className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-chalk/50 pb-5">
      <div>
        <p className="font-condensed text-sm font-semibold tracking-[0.18em] text-gold uppercase">Đội bóng sân 7</p>
        <h1 className="font-display text-6xl leading-[0.95] uppercase sm:text-8xl">{TEAM_NAME}</h1>
      </div>
      <dl className="grid grid-cols-2 border border-chalk/35 bg-black/30 sm:grid-cols-4">
        {board.map((item) => (
          <div key={item.label} className="border-chalk/20 px-4 py-2 text-center not-first:border-l max-sm:nth-3:border-l-0">
            <dt className="font-condensed text-xs font-semibold tracking-[0.12em] text-chalk-dim uppercase">{item.label}</dt>
            <dd className="font-condensed text-3xl font-bold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

import { BenchRow } from "@/components/matches/BenchRow";
import { Pitch } from "@/components/matches/Pitch";
import { formatMatchDateTime } from "@/lib/utils/date";
import { getFormationLabel } from "@/lib/utils/formation";
import type { MatchLineup } from "@/types/match";

type LatestLineupProps = {
  lineup: MatchLineup | null;
};

const SECTION_TITLE_CLASS = "font-condensed text-base font-bold tracking-[0.2em] text-chalk-dim uppercase";

export function LatestLineup({ lineup }: LatestLineupProps) {
  if (!lineup) {
    return (
      <section className="grid gap-2">
        <h2 className={SECTION_TITLE_CLASS}>Đội hình ra sân</h2>
        <p className="border border-dashed border-chalk/40 px-4 py-6 text-center text-chalk-dim">
          Đội hình ra sân sẽ hiện ở đây sau buổi đá đầu tiên.
        </p>
      </section>
    );
  }

  const { sideA, sideB } = lineup;
  const formations = `${getFormationLabel(sideA.starters)} · ${getFormationLabel(sideB.starters)}`;

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className={SECTION_TITLE_CLASS}>{lineup.isFinished ? "Đội hình buổi gần nhất" : "Đội hình buổi sắp tới"}</h2>
          <p className="font-condensed tracking-wide text-chalk-dim">
            {formatMatchDateTime(lineup.playedAt)}
            {lineup.venue && ` · ${lineup.venue}`} · Sơ đồ {formations}
          </p>
        </div>
        {lineup.isFinished && (
          <p className="font-condensed text-3xl font-bold tabular-nums">
            <span className="text-blau-light">{sideA.name}</span> {sideA.score}–{sideB.score}{" "}
            <span className="text-grana-light">{sideB.name}</span>
          </p>
        )}
      </div>
      <Pitch sideA={sideA} sideB={sideB} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BenchRow side={sideA} cardSide="a" />
        <BenchRow side={sideB} cardSide="b" />
      </div>
    </section>
  );
}

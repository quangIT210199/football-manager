import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GoalTimeline } from "@/app/(public)/matches/[matchId]/_components/GoalTimeline";
import { BenchRow } from "@/components/matches/BenchRow";
import { Pitch } from "@/components/matches/Pitch";
import { ROUTES } from "@/lib/constants";
import { getMatchLineup } from "@/lib/server/lineups";
import { getPublicMatch } from "@/lib/server/publicMatches";
import { formatMatchDateTime } from "@/lib/utils/date";
import { getFormationLabel } from "@/lib/utils/formation";
import { getNameByPlayerId, getSideByPlayerId } from "@/lib/utils/lineup";

export const revalidate = 3600;

// Render khi có người mở lần đầu rồi lưu lại; admin sửa trận sẽ làm mới qua revalidatePath.
export function generateStaticParams(): Array<{ matchId: string }> {
  return [];
}

const SECTION_TITLE_CLASS = "font-condensed text-base font-bold tracking-[0.2em] text-chalk-dim uppercase";

export async function generateMetadata({ params }: PageProps<"/matches/[matchId]">): Promise<Metadata> {
  const { matchId } = await params;
  const data = await getPublicMatch(matchId);
  if (!data) return { title: "Không tìm thấy trận đấu" };

  const { match } = data;
  const score = match.status === "finished" ? `${match.score_a}–${match.score_b}` : "vs";
  return {
    title: `${match.side_a_name} ${score} ${match.side_b_name}`,
    description: `Buổi đá ${formatMatchDateTime(match.played_at)}${match.venue ? ` tại ${match.venue}` : ""}.`,
  };
}

export default async function MatchDetailPage({ params }: PageProps<"/matches/[matchId]">) {
  const { matchId } = await params;
  const [data, lineup] = await Promise.all([getPublicMatch(matchId), getMatchLineup(matchId)]);
  if (!data) notFound();

  const { match, goals } = data;
  const isFinished = match.status === "finished";

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-8">
      <Link href={ROUTES.matches} className="text-sm text-chalk-dim hover:text-chalk">
        ← Tất cả trận đấu
      </Link>
      <header className="grid gap-3 text-center">
        <p className="font-condensed tracking-[0.08em] text-chalk-dim uppercase">
          {formatMatchDateTime(match.played_at)}
          {match.venue && ` · ${match.venue}`}
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
          <h1 className="font-display text-2xl text-blau-light uppercase sm:text-4xl">{match.side_a_name}</h1>
          <p className="bg-night-deep px-5 py-1 font-condensed text-5xl font-bold tabular-nums ring-2 ring-gold sm:text-7xl">
            {isFinished ? `${match.score_a}–${match.score_b}` : "vs"}
          </p>
          <p className="font-display text-2xl text-grana-light uppercase sm:text-4xl">{match.side_b_name}</p>
        </div>
        {!isFinished && <p className="text-gold">Sắp diễn ra</p>}
      </header>

      <section className="grid gap-4">
        <h2 className={SECTION_TITLE_CLASS}>
          Đội hình ra sân{lineup && ` · ${getFormationLabel(lineup.sideA.starters)} · ${getFormationLabel(lineup.sideB.starters)}`}
        </h2>
        {lineup ? (
          <>
            <Pitch sideA={lineup.sideA} sideB={lineup.sideB} />
            <div className="grid gap-4 sm:grid-cols-2">
              <BenchRow side={lineup.sideA} cardSide="a" />
              <BenchRow side={lineup.sideB} cardSide="b" />
            </div>
          </>
        ) : (
          <p className="text-chalk-dim">Đội hình chưa được công bố.</p>
        )}
      </section>

      {isFinished && (
        <section className="grid max-w-2xl gap-2">
          <h2 className={SECTION_TITLE_CLASS}>Diễn biến</h2>
          <GoalTimeline
            match={match}
            goals={goals}
            sideByPlayerId={getSideByPlayerId(lineup)}
            nameByPlayerId={getNameByPlayerId(lineup)}
          />
        </section>
      )}

      {match.notes && <p className="max-w-2xl border-l-2 border-gold pl-3 text-chalk-dim">{match.notes}</p>}
    </main>
  );
}

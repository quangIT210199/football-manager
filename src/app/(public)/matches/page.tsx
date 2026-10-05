import type { Metadata } from "next";

import { MatchListItem } from "@/app/(public)/matches/_components/MatchListItem";
import { listPublicMatches } from "@/lib/server/publicMatches";
import type { Match } from "@/types/match";

export const metadata: Metadata = {
  title: "Trận đấu",
  description: "Lịch các buổi đá nội bộ và kết quả của đội.",
};

export const revalidate = 3600;

type MatchGroupProps = {
  title: string;
  matches: Match[];
};

function MatchGroup({ title, matches }: MatchGroupProps) {
  if (matches.length === 0) return null;
  return (
    <section className="grid gap-3">
      <h2 className="flex items-center gap-3 font-condensed text-base font-bold tracking-[0.2em] uppercase after:h-px after:flex-1 after:bg-chalk/40">
        {title} · {matches.length}
      </h2>
      <ul className="grid gap-2.5">
        {matches.map((match) => (
          <MatchListItem key={match.id} match={match} />
        ))}
      </ul>
    </section>
  );
}

export default async function MatchesPage() {
  const matches = await listPublicMatches();
  // Sắp diễn ra: gần nhất lên đầu; kết quả: mới nhất lên đầu.
  const upcoming = matches.filter((match) => match.status !== "finished").reverse();
  const finished = matches.filter((match) => match.status === "finished");

  return (
    <main className="mx-auto grid max-w-4xl gap-10 px-4 py-8 sm:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-6xl">Trận đấu</h1>
      {matches.length === 0 ? (
        <p className="border border-dashed border-chalk/40 px-4 py-6 text-center text-chalk-dim">Chưa có buổi đá nào.</p>
      ) : (
        <>
          <MatchGroup title="Sắp diễn ra" matches={upcoming} />
          <MatchGroup title="Kết quả" matches={finished} />
        </>
      )}
    </main>
  );
}

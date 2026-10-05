import Link from "next/link";

import { getMatchPath } from "@/lib/constants";
import { formatMatchDateTime } from "@/lib/utils/date";
import type { Match } from "@/types/match";

type MatchListItemProps = {
  match: Match;
};

export function MatchListItem({ match }: MatchListItemProps) {
  const isFinished = match.status === "finished";

  return (
    <li>
      <Link
        href={getMatchPath(match.id)}
        className="grid gap-2 border-l-[3px] border-gold bg-black/30 px-4 py-3 transition-colors hover:bg-black/45 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      >
        <span className="font-condensed text-sm tracking-wide text-chalk-dim">
          {formatMatchDateTime(match.played_at)}
          {match.venue && ` · ${match.venue}`}
        </span>
        <span className="flex items-center gap-3 font-condensed text-xl font-bold sm:justify-end">
          <span className="text-blau-light">{match.side_a_name}</span>
          <span className="min-w-[4.5rem] bg-night-deep px-2 text-center text-2xl tabular-nums ring-1 ring-gold/70">
            {isFinished ? `${match.score_a}–${match.score_b}` : "vs"}
          </span>
          <span className="text-grana-light">{match.side_b_name}</span>
        </span>
      </Link>
    </li>
  );
}

"use client";

import { useState, useTransition } from "react";

import { LineupPreview } from "@/app/admin/matches/[matchId]/_components/LineupPreview";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { INITIAL_FORM_STATE, MAX_STARTERS_PER_SIDE } from "@/lib/constants";
import { getPositionLabel, sortPlayersByPosition } from "@/lib/utils/position";
import type { FormState } from "@/types/form";
import type { LineupEntry, LineupSide, MatchSideCode } from "@/types/match";
import type { LineupPlayer } from "@/types/player";

type Slot = {
  side: MatchSideCode;
  isStarter: boolean;
};

const SLOT_BY_VALUE: Record<string, Slot> = {
  "A-starter": { side: "A", isStarter: true },
  "A-bench": { side: "A", isStarter: false },
  "B-starter": { side: "B", isStarter: true },
  "B-bench": { side: "B", isStarter: false },
};

const ROW_TINT: Record<string, string> = {
  "A-starter": "border-blau bg-blau/10",
  "A-bench": "border-blau/40 bg-blau/5",
  "B-starter": "border-grana bg-grana/10",
  "B-bench": "border-grana/40 bg-grana/5",
};

type LineupEditorProps = {
  action: (entries: LineupEntry[]) => Promise<FormState>;
  players: LineupPlayer[];
  initialEntries: LineupEntry[];
  sideAName: string;
  sideBName: string;
};

function toSlotValue(entry: LineupEntry): string {
  return `${entry.side}-${entry.is_starter ? "starter" : "bench"}`;
}

function toEntries(values: Record<string, string>): LineupEntry[] {
  return Object.entries(values).flatMap(([playerId, value]) => {
    const slot = SLOT_BY_VALUE[value];
    return slot ? [{ player_id: playerId, side: slot.side, is_starter: slot.isStarter }] : [];
  });
}

function buildSide(name: string, side: MatchSideCode, entries: LineupEntry[], players: LineupPlayer[]): LineupSide {
  const pick = (isStarter: boolean) => {
    const ids = new Set(entries.filter((e) => e.side === side && e.is_starter === isStarter).map((e) => e.player_id));
    return sortPlayersByPosition(players.filter((player) => ids.has(player.id)));
  };
  return { name, score: null, starters: pick(true), bench: pick(false) };
}

export function LineupEditor({ action, players, initialEntries, sideAName, sideBName }: LineupEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialEntries.map((entry) => [entry.player_id, toSlotValue(entry)])),
  );
  const [result, setResult] = useState<FormState>(INITIAL_FORM_STATE);
  const [isPending, startTransition] = useTransition();

  const entries = toEntries(values);
  const sideA = buildSide(sideAName, "A", entries, players);
  const sideB = buildSide(sideBName, "B", entries, players);
  const isOverLimit = [sideA, sideB].some((side) => side.starters.length > MAX_STARTERS_PER_SIDE);
  const slotOptions = [
    { value: "", label: "Không tham gia" },
    { value: "A-starter", label: `${sideAName} · đá chính` },
    { value: "A-bench", label: `${sideAName} · dự bị` },
    { value: "B-starter", label: `${sideBName} · đá chính` },
    { value: "B-bench", label: `${sideBName} · dự bị` },
  ];

  function save() {
    startTransition(async () => setResult(await action(entries)));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        {[sideA, sideB].map((side, index) => (
          <span
            key={side.name + index}
            className={`rounded-full px-3 py-1 ${index === 0 ? "bg-blau/10 text-blau" : "bg-grana/10 text-grana"} ${
              side.starters.length > MAX_STARTERS_PER_SIDE ? "ring-2 ring-danger" : ""
            }`}
          >
            {side.name}: {side.starters.length}/{MAX_STARTERS_PER_SIDE} đá chính · {side.bench.length} dự bị
          </span>
        ))}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {players.map((player) => {
          const value = values[player.id] ?? "";
          return (
            <li key={player.id} className={`flex items-center gap-3 rounded-md border px-3 py-2 ${ROW_TINT[value] ?? "border-line bg-white"}`}>
              <span className="w-7 text-right font-mono text-sm text-muted tabular-nums">{player.shirt_number ?? "–"}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{player.full_name}</span>
                <span className="text-xs text-muted">{getPositionLabel(player.position)}</span>
              </span>
              <select
                aria-label={`Vị trí trong trận của ${player.full_name}`}
                value={value}
                onChange={(event) => setValues((current) => ({ ...current, [player.id]: event.target.value }))}
                className="max-w-40 rounded-md border border-line bg-white px-2 py-1.5 text-sm"
              >
                {slotOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={isPending || isOverLimit}>
          {isPending ? "Đang lưu…" : "Lưu đội hình"}
        </Button>
        {isOverLimit && <span className="text-sm text-danger">Mỗi bên tối đa {MAX_STARTERS_PER_SIDE} cầu thủ đá chính.</span>}
      </div>
      <FormMessage state={result} />
      <LineupPreview sideA={sideA} sideB={sideB} />
    </div>
  );
}

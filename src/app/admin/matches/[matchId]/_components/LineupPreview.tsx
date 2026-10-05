import { BenchRow } from "@/components/matches/BenchRow";
import { Pitch } from "@/components/matches/Pitch";
import type { LineupSide } from "@/types/match";

type LineupPreviewProps = {
  sideA: LineupSide;
  sideB: LineupSide;
};

/** Xem trước sơ đồ ra sân đúng như trang công khai. */
export function LineupPreview({ sideA, sideB }: LineupPreviewProps) {
  return (
    <div className="bg-blaugrana grid gap-4 rounded-lg p-3 text-chalk sm:p-5">
      <Pitch sideA={sideA} sideB={sideB} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BenchRow side={sideA} cardSide="a" />
        <BenchRow side={sideB} cardSide="b" />
      </div>
    </div>
  );
}

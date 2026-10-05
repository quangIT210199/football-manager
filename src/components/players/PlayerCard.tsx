import Image from "next/image";

import { PlayerSilhouette } from "@/components/players/PlayerSilhouette";
import { getShortName } from "@/lib/utils/playerDisplay";

export type PlayerCardSide = "a" | "b";

type PlayerCardProps = {
  fullName: string;
  shirtNumber: number | null;
  positionShort: string;
  photoUrl: string | null;
  side?: PlayerCardSide;
  /** Độ rộng thẻ (vd "w-24"); chữ trên thẻ tự co theo độ rộng. */
  className?: string;
};

const SHIELD_CLIP = "[clip-path:polygon(50%_0,100%_6%,100%_86%,50%_100%,0_86%,0_6%)]";

const FACE_BY_SIDE: Record<PlayerCardSide, string> = {
  a: "from-[#2f7fd6] to-[#002a5c]",
  b: "from-[#d1306f] to-[#4f0021]",
};

/** Thẻ cầu thủ kiểu PES / FIFA: viền vàng, nền màu bên, số áo, vị trí, ảnh 3:4, tên. */
export function PlayerCard({ fullName, shirtNumber, positionShort, photoUrl, side = "a", className = "w-24" }: PlayerCardProps) {
  return (
    <div className={`@container aspect-[5/7] shrink-0 bg-linear-160 from-[#fff3b0] via-gold to-[#8a6b00] p-[3%] ${SHIELD_CLIP} ${className}`}>
      <div className={`relative size-full bg-linear-to-b ${FACE_BY_SIDE[side]} ${SHIELD_CLIP}`}>
        <div className="absolute top-[12%] left-[14%] h-[62%] w-[80%]">
          {photoUrl ? (
            <Image src={photoUrl} alt={`Ảnh ${fullName}`} fill unoptimized sizes="200px" className="object-cover object-top" />
          ) : (
            <PlayerSilhouette />
          )}
        </div>
        <span className="absolute top-[8%] left-[8%] font-display text-[27cqw] leading-none text-gold [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
          {shirtNumber ?? ""}
        </span>
        <span className="absolute top-[30%] left-[9%] font-condensed text-[13cqw] leading-none font-bold text-white">
          {positionShort}
        </span>
        <span className="absolute inset-x-[4%] bottom-[15%] truncate border-t border-gold/80 pt-[3%] text-center font-condensed text-[17cqw] leading-tight font-bold text-white uppercase">
          {getShortName(fullName)}
        </span>
      </div>
    </div>
  );
}

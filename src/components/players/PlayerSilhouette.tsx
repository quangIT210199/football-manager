type PlayerSilhouetteProps = {
  className?: string;
};

/** Hình bóng mặc định khi cầu thủ chưa có ảnh. */
export function PlayerSilhouette({ className = "size-full" }: PlayerSilhouetteProps) {
  return (
    <svg viewBox="0 0 60 80" aria-hidden="true" className={className} preserveAspectRatio="xMidYMax meet">
      <circle cx="30" cy="27" r="13" fill="#dfe5f3" fillOpacity="0.85" />
      <path d="M4 80c1-19 12-30 26-30s25 11 26 30z" fill="#dfe5f3" fillOpacity="0.85" />
    </svg>
  );
}

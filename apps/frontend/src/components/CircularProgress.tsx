/**
 * Circular progress bar with dynamic color from red (0) → green (100).
 * - Pure SVG. No external deps.
 * - Accessible (role=progressbar + ARIA attrs).
 * - Smoothly animates when `value` changes.
 *
 * Usage:
 * <CircularProgress value={72} size={128} strokeWidth={12} />
 */
export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  trackColor = "#e5e7eb",
  showLabel = true,
  rounded = true,
  className = "",
  labelColor = "#111827",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  showLabel?: boolean;
  rounded?: boolean;
  className?: string;
  labelColor?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));

  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - clamped / 100);

  const hue = (clamped * 120) / 100;
  const strokeColor = `hsl(${hue}, 90%, 45%)`;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label="Progress"
      title={`${Math.round(clamped)}%`}
    >
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease",
          }}
        />

        {showLabel && (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="select-none"
            style={{ fontSize: size * 0.22, fontWeight: 600, fill: labelColor }}
          >
            {Math.round(clamped)}%
          </text>
        )}
      </svg>
    </div>
  );
}

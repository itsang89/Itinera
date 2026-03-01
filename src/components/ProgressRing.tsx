interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  variant?: 'default' | 'compact'
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  variant = 'default',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-dark-elevated"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="stroke-sky-400 dark:stroke-sky-500 transition-all duration-500"
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: variant === 'compact' ? '0.7rem' : undefined }}
        >
          {sublabel ? (
            <span className="text-neutral-charcoal dark:text-neutral-100 font-bold leading-tight text-center">
              {sublabel}
            </span>
          ) : (
            <span className="text-neutral-charcoal dark:text-neutral-100 font-bold">
              {percent.toFixed(0)}%
            </span>
          )}
          {label && variant === 'default' && (
            <span className="text-[10px] font-semibold text-neutral-gray dark:text-neutral-400 mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
      {label && variant === 'compact' && (
        <span className="text-[10px] font-semibold text-neutral-gray dark:text-neutral-400">
          {label}
        </span>
      )}
    </div>
  )
}

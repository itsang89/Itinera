export function PageSkeleton() {
  return (
    <div className="px-6 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-soft-gray dark:bg-dark-elevated rounded-lg w-3/4" />
      <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-1/2" />
      <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-full" />
      <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-5/6" />
      <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-4/5" />
      <div className="h-24 bg-soft-gray dark:bg-dark-elevated rounded-2xl mt-6" />
      <div className="h-24 bg-soft-gray dark:bg-dark-elevated rounded-2xl" />
      <div className="h-24 bg-soft-gray dark:bg-dark-elevated rounded-2xl" />
    </div>
  )
}

export function TripCardSkeleton() {
  return (
    <div className="p-5 rounded-ios bg-white dark:bg-dark-surface border border-border-gray/60 dark:border-dark-border animate-pulse">
      <div className="h-5 bg-soft-gray dark:bg-dark-elevated rounded w-2/3 mb-3" />
      <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-1/2 mb-2" />
      <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-1/3" />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border"
        >
          <div className="w-10 h-10 rounded-full bg-soft-gray dark:bg-dark-elevated" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-3/4" />
            <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

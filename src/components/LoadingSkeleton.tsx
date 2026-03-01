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
    <div className="rounded-ios overflow-hidden bg-white dark:bg-dark-surface border border-border-gray/60 dark:border-dark-border animate-pulse">
      <div className="p-5 pr-24 space-y-2">
        <div className="flex justify-between items-start gap-3">
          <div className="h-5 bg-soft-gray dark:bg-dark-elevated rounded w-2/3" />
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-12" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-4" />
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-1/2" />
        </div>
        <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-1/3 ml-[22px]" />
      </div>
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
          <div className="w-10 h-10 rounded-full bg-soft-gray dark:bg-dark-elevated shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-3/4" />
            <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ItineraryItemSkeleton() {
  return (
    <div className="timeline-item timeline-line relative flex gap-6 pb-10 animate-pulse">
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-soft-gray dark:bg-dark-elevated border-4 border-white dark:border-dark-surface shrink-0" />
      </div>
      <div className="flex-1 pt-1 min-w-0">
        <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-12 mb-2" />
        <div className="p-5 rounded-ios bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border space-y-2">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-soft-gray dark:bg-dark-elevated rounded w-3/4" />
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-soft-gray dark:bg-dark-elevated rounded-lg" />
              <div className="w-16 h-8 bg-soft-gray dark:bg-dark-elevated rounded-lg" />
            </div>
          </div>
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-full" />
        </div>
      </div>
    </div>
  )
}

export function ExpenseItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border animate-pulse">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-soft-gray dark:bg-dark-elevated shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-3/4" />
          <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-1/2" />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-12" />
        <div className="w-14 h-8 bg-soft-gray dark:bg-dark-elevated rounded-lg" />
      </div>
    </div>
  )
}

export function PackingItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-2xl animate-pulse">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-6 h-6 rounded-lg border-2 border-gray-200 dark:border-dark-border shrink-0" />
        <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-2/3" />
      </div>
      <div className="w-14 h-8 bg-soft-gray dark:bg-dark-elevated rounded-lg shrink-0" />
    </div>
  )
}

export function TripOverviewSkeleton() {
  return (
    <div className="flex flex-col overflow-x-hidden pb-24 animate-pulse">
      <div className="flex items-center bg-white/80 dark:bg-dark-surface/80 px-6 py-4 justify-between border-b border-gray-100 dark:border-dark-border">
        <div className="w-11 h-11 rounded-full bg-soft-gray dark:bg-dark-elevated" />
        <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-24" />
        <div className="w-11 h-11 rounded-full bg-soft-gray dark:bg-dark-elevated" />
      </div>
      <div className="px-6 pt-6 pb-4">
        <div className="rounded-2xl overflow-hidden bg-soft-gray/50 dark:bg-dark-elevated/50 border border-gray-100 dark:border-dark-border p-6 space-y-2">
          <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-16" />
          <div className="h-7 bg-soft-gray dark:bg-dark-elevated rounded w-3/4" />
          <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-1/2 mt-2" />
        </div>
      </div>
      <div className="px-6 mt-6 flex flex-col gap-6">
        <div className="h-24 rounded-2xl bg-soft-gray dark:bg-dark-elevated" />
        <div className="h-24 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border p-5 space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-soft-gray dark:bg-dark-elevated" />
              <div className="space-y-2">
                <div className="h-4 bg-soft-gray dark:bg-dark-elevated rounded w-16" />
                <div className="h-3 bg-soft-gray dark:bg-dark-elevated rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

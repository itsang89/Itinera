import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTrip } from '@/hooks/useTrip'
import { useTripDays } from '@/hooks/useTripDays'
import {
  useActivities,
  getCategoryIcon,
} from '@/hooks/useActivities'
import type { Activity } from '@/types'
import ActivityForm from '@/components/itinerary/ActivityForm'
import { CURRENCY_SYMBOLS, daysUntil } from '@/lib/utils'
import { PageSkeleton, ItineraryItemSkeleton } from '@/components/LoadingSkeleton'
import { ConfirmModal } from '@/components/ConfirmModal'

function SortableActivityItem({
  activity,
  onDelete,
  onEdit,
  dragDisabled,
}: {
  activity: Activity
  onDelete: () => void
  onEdit: () => void
  dragDisabled?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const icon = getCategoryIcon(activity.category)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`timeline-item relative flex gap-6 pb-10 timeline-line ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="relative z-10 flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className={`w-12 h-12 rounded-full bg-soft-gray dark:bg-dark-elevated flex items-center justify-center border-4 border-white dark:border-dark-surface shadow-sm ${
            dragDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing'
          }`}
          style={dragDisabled ? { pointerEvents: 'none' } : undefined}
        >
          <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-xl">
            {icon}
          </span>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <span className="text-xs font-bold text-neutral-gray dark:text-neutral-400">
          {activity.startTime}
        </span>
        <div className="mt-2 p-5 rounded-ios bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 leading-tight">
              {activity.name}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-soft-gray dark:hover:bg-dark-elevated text-neutral-gray dark:text-neutral-400"
                aria-label="Edit activity"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-neutral-gray dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium"
                aria-label="Delete activity"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-neutral-gray dark:text-neutral-400 mt-1">
            {activity.location || activity.notes || 'No details'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const { trip, loading: tripLoading } = useTrip(tripId)
  const { days } = useTripDays(tripId)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [reordering, setReordering] = useState(false)
  const { showToast } = useToast()

  const activeDayId = selectedDayId ?? days[0]?.id ?? null
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
  } = useActivities(tripId, activeDayId)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || reordering) return
    const oldIndex = activities.findIndex((a) => a.id === active.id)
    const newIndex = activities.findIndex((a) => a.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(activities, oldIndex, newIndex)
    setReordering(true)
    try {
      await reorderActivities(newOrder)
    } finally {
      setReordering(false)
    }
  }

  const handleSaveActivity = async (data: Omit<Activity, 'id'>) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, data)
      showToast('Activity updated!')
      setEditingActivity(null)
    } else {
      await addActivity({ ...data, order: activities.length })
      showToast('Activity added!')
    }
    setShowForm(false)
  }

  const handleDeleteActivity = async (activity: Activity) => {
    await deleteActivity(activity.id)
    showToast('Activity deleted')
    setActivityToDelete(null)
  }

  if (tripLoading || !trip) {
    return <PageSkeleton />
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl px-6 py-5 border-b border-gray-50 dark:border-dark-border">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${tripId}`}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
              aria-label="Back to trip overview"
            >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100 text-xl">
                arrow_back_ios_new
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal dark:text-neutral-100">
                Itinerary
              </h1>
              <p className="text-[11px] font-medium text-neutral-gray dark:text-neutral-400 truncate max-w-[180px]">
                {trip.destination}
              </p>
              {daysUntil(trip.startDate) > 0 && (
                <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                  {daysUntil(trip.startDate)} day{daysUntil(trip.startDate) !== 1 ? 's' : ''} until departure
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/profile"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100">
                account_circle
              </span>
            </Link>
            <button
              onClick={() => setShowMoreMenu(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-soft-gray dark:bg-dark-elevated"
              aria-label="More options"
            >
              <span className="material-symbols-outlined text-neutral-charcoal dark:text-neutral-100">
                more_horiz
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="sticky top-[81px] z-20 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="flex gap-4 px-6 py-4 overflow-x-auto no-scrollbar items-center">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-bold shadow-sm ${
                activeDayId === day.id
                  ? 'gradient-accent text-sky-900'
                  : 'bg-soft-gray dark:bg-dark-elevated text-neutral-gray dark:text-neutral-400 hover:text-neutral-charcoal dark:hover:text-neutral-100'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>
      </div>
      <main className="flex-1 max-w-md mx-auto w-full pb-32">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .timeline-line::before {
            content: '';
            position: absolute;
            left: 23px;
            top: 40px;
            bottom: 0;
            width: 1px;
            background-color: #E5E7EB;
          }
          .dark .timeline-line::before {
            background-color: #404040;
          }
          .timeline-item:last-child .timeline-line::before { display: none; }
        `}</style>
        <div className="px-6 py-8 space-y-0">
          {activitiesError && (
            <div className="px-6 mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm">
              Could not load activities: {activitiesError.message}
            </div>
          )}
          {!activeDayId ? (
            <div className="py-12 text-center text-neutral-gray dark:text-neutral-400">
              No days for this trip.
            </div>
          ) : activitiesLoading ? (
            <div className="space-y-0">
              <ItineraryItemSkeleton />
              <ItineraryItemSkeleton />
              <ItineraryItemSkeleton />
              <ItineraryItemSkeleton />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center py-14 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border bg-soft-gray/30 dark:bg-dark-elevated/30 text-center">
              <span className="material-symbols-outlined text-5xl text-neutral-300 dark:text-neutral-500 mb-4">
                event_note
              </span>
              <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-1">
                No activities yet
              </h3>
              <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-5 max-w-[260px]">
                Add places to visit, restaurants, and experiences. Drag to reorder your day.
              </p>
              <button
                onClick={() => {
                  setEditingActivity(null)
                  setShowForm(true)
                }}
                className="inline-flex items-center gap-2 py-3 px-5 gradient-accent text-sky-900 dark:text-sky-100 font-bold rounded-ios shadow-sm active:scale-[0.98] transition-transform"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Add your first activity
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activities.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {activities.map((activity) => (
                  <SortableActivityItem
                    key={activity.id}
                    activity={activity}
                    onDelete={() => setActivityToDelete(activity)}
                    dragDisabled={reordering}
                    onEdit={() => {
                      setEditingActivity(activity)
                      setShowForm(true)
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>
      <button
        onClick={() => {
          setEditingActivity(null)
          setShowForm(true)
        }}
        className="fixed bottom-36 right-6 size-14 min-w-[44px] min-h-[44px] gradient-accent text-sky-900 dark:text-sky-100 rounded-full shadow-lg shadow-sky-300/50 dark:shadow-sky-900/30 flex items-center justify-center active:scale-90 transition-all z-40"
        aria-label="Add activity"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showMoreMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">Options</h3>
            <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-4">
              Share itinerary and export options are coming soon.
            </p>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="w-full py-3 rounded-ios font-semibold gradient-accent text-sky-900"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <ActivityForm
          tripId={tripId!}
          dayId={activeDayId!}
          activity={editingActivity}
          currencySymbol={trip ? (CURRENCY_SYMBOLS[trip.currency] ?? trip.currency) : '$'}
          onSave={handleSaveActivity}
          onClose={() => {
            setShowForm(false)
            setEditingActivity(null)
          }}
        />
      )}

      <ConfirmModal
        open={!!activityToDelete}
        title="Delete activity"
        message="Are you sure you want to delete this activity?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => { if (activityToDelete) await handleDeleteActivity(activityToDelete) }}
        onCancel={() => setActivityToDelete(null)}
      />
    </>
  )
}

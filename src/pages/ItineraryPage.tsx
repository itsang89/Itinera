import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

function SortableActivityItem({
  activity,
  onDelete,
  onEdit,
}: {
  activity: Activity
  onDelete: () => void
  onEdit: () => void
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
          className="cursor-grab active:cursor-grabbing w-12 h-12 rounded-full bg-soft-gray flex items-center justify-center border-4 border-white shadow-sm"
        >
          <span className="material-symbols-outlined text-neutral-charcoal text-xl">
            {icon}
          </span>
        </div>
      </div>
      <div className="flex-1 pt-1">
        <span className="text-xs font-bold text-neutral-gray uppercase tracking-widest">
          {activity.startTime}
        </span>
        <div className="mt-2 p-5 rounded-ios bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-neutral-charcoal leading-tight">
              {activity.name}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-1 rounded hover:bg-soft-gray text-neutral-gray"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={onDelete}
                className="p-1 rounded hover:bg-red-50 text-neutral-gray hover:text-red-500"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-neutral-gray mt-1">
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

  const activeDayId = selectedDayId ?? days[0]?.id ?? null
  const {
    activities,
    loading: activitiesLoading,
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = activities.findIndex((a) => a.id === active.id)
    const newIndex = activities.findIndex((a) => a.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(activities, oldIndex, newIndex)
    reorderActivities(newOrder)
  }

  const handleSaveActivity = async (data: Omit<Activity, 'id'>) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, data)
      setEditingActivity(null)
    } else {
      await addActivity({ ...data, order: activities.length })
    }
    setShowForm(false)
  }

  const handleDeleteActivity = async (activity: Activity) => {
    if (!confirm('Delete this activity?')) return
    await deleteActivity(activity.id)
  }

  if (tripLoading || !trip) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-5 border-b border-gray-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${tripId}`}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray"
            >
              <span className="material-symbols-outlined text-neutral-charcoal text-xl">
                arrow_back_ios_new
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-charcoal">
                {trip.title}
              </h1>
              <p className="text-[11px] font-medium text-neutral-gray uppercase tracking-wider">
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-soft-gray">
            <span className="material-symbols-outlined text-neutral-charcoal">
              more_horiz
            </span>
          </button>
        </div>
      </header>
      <div className="sticky top-[81px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 overflow-hidden">
        <div className="flex gap-4 px-6 py-4 overflow-x-auto no-scrollbar items-center">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-none px-5 py-2.5 rounded-full text-sm font-bold shadow-sm ${
                activeDayId === day.id
                  ? 'gradient-accent text-sky-900'
                  : 'bg-soft-gray text-neutral-gray hover:text-neutral-charcoal'
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
          .timeline-item:last-child .timeline-line::before { display: none; }
        `}</style>
        <div className="px-6 py-8 space-y-0">
          {!activeDayId ? (
            <div className="py-12 text-center text-neutral-gray">
              No days for this trip.
            </div>
          ) : activitiesLoading ? (
            <div className="py-12 text-center text-neutral-gray">
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center text-neutral-gray">
              No activities yet. Tap + to add one.
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
                    onDelete={() => handleDeleteActivity(activity)}
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
        className="fixed bottom-28 right-6 size-14 gradient-accent text-sky-900 rounded-full shadow-lg shadow-sky-200/50 flex items-center justify-center active:scale-90 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showForm && (
        <ActivityForm
          tripId={tripId!}
          dayId={activeDayId!}
          activity={editingActivity}
          onSave={handleSaveActivity}
          onClose={() => {
            setShowForm(false)
            setEditingActivity(null)
          }}
        />
      )}
    </>
  )
}

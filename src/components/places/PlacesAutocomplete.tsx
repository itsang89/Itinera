import { useRef, useEffect, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { env } from '@/lib/env'

export interface PlaceResult {
  formatted_address: string
  lat: number
  lng: number
  name?: string
}

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: PlaceResult) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function FallbackInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
  disabled,
}: PlacesAutocompleteProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => value.trim() && onPlaceSelect({ formatted_address: value.trim(), lat: 0, lng: 0 })}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray pointer-events-none">
        search
      </span>
    </div>
  )
}

export function PlacesAutocomplete(props: PlacesAutocompleteProps) {
  const { placeholder = 'Search for a place...', className = '', disabled = false } = props
  if (!env.googleMapsApiKey) {
    return <FallbackInput {...props} placeholder={placeholder} className={className} disabled={disabled} />
  }
  return <PlacesAutocompleteImpl {...props} />
}

function PlacesAutocompleteImpl({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Search for a place...',
  className = '',
  disabled = false,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary('places')
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!places || !inputRef.current) return
    const ac = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    })
    setAutocomplete(ac)
    return () => setAutocomplete(null)
  }, [places])

  useEffect(() => {
    if (!autocomplete) return
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        onPlaceSelect({
          formatted_address: place.formatted_address ?? '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name ?? undefined,
        })
      }
    })
    return () => listener.remove()
  }, [autocomplete, onPlaceSelect])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray pointer-events-none">
        search
      </span>
    </div>
  )
}

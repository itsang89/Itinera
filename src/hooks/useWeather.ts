import { useEffect, useState } from 'react'

export interface WeatherDay {
  date: string
  tempMax: number
  tempMin: number
  weatherCode: number
}

export interface WeatherData {
  current: {
    temp: number
    feelsLike: number
    description: string
    weatherCode: number
  }
  daily: WeatherDay[]
}

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Heavy Rain Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

function getWeatherDescription(code: number) {
  return WEATHER_CODES[code] ?? 'Unknown'
}

export function useWeather(lat: number, lng: number, enabled: boolean) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled || (lat === 0 && lng === 0)) {
      setData(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        const current = json.current
        const daily = json.daily
        setData({
          current: {
            temp: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.temperature_2m),
            description: getWeatherDescription(current.weather_code),
            weatherCode: current.weather_code,
          },
          daily: daily.time.map((date: string, i: number) => ({
            date,
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            weatherCode: daily.weather_code[i],
          })),
        })
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lat, lng, enabled])

  return { data, loading, error }
}

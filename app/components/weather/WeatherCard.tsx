"use client";

import { useEffect, useMemo, useState } from "react";
import FadeIn from "@/app/components/motion/FadeIn";

type Props = {
  locationLabel?: string; // display label
  latitude?: number;      // override if provided
  longitude?: number;     // override if provided
  variant?: "card" | "strip";
};

type WeatherData = {
  tempF: number;
  feelsF: number;
  windMph: number;
  humidity: number;
  dewpointF: number;
  weathercode: number;
  sunrise?: string;
  sunset?: string;

  tomorrow?: {
    highF: number | null;
    lowF: number | null;
    weathercode: number | null;
  };
};

type OpenMeteoResponse = {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string; // ISO-ish string
  };
  hourly?: {
    time: string[];
    relative_humidity_2m?: number[];
    apparent_temperature?: number[];
    dew_point_2m?: number[];
  };
 daily?: {
  sunrise?: string[];
  sunset?: string[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  weathercode?: number[];
};
};

function cToF(c: number) {
  return (c * 9) / 5 + 32;
}
function msToMph(ms: number) {
  return ms * 2.236936;
}

function safeNum(n: unknown, fallback = 0) {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

function findHourIndex(hourlyTimes: string[] | undefined, targetTime: string | undefined) {
  if (!hourlyTimes?.length || !targetTime) return 0;
  const idx = hourlyTimes.indexOf(targetTime);
  if (idx >= 0) return idx;

  // fallback: nearest by time difference
  const target = new Date(targetTime).getTime();
  if (!Number.isFinite(target)) return 0;

  let bestIdx = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  for (let i = 0; i < hourlyTimes.length; i++) {
    const t = new Date(hourlyTimes[i]).getTime();
    if (!Number.isFinite(t)) continue;
    const diff = Math.abs(t - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function tomorrowEmoji(code: number | null | undefined) {
  if (typeof code !== "number") return "🌤️";
  return weatherEmoji(code);
}

function weatherEmoji(code: number) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Mostly Clear";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Storms";
  return "Mixed";
}

function vibeClasses(code: number) {
  if (code === 0) return { wrap: "bg-[color-mix(in_srgb,var(--harbor)_8%,white)]", badge: "bg-amber-100" };
  if ([1, 2, 3].includes(code)) return { wrap: "bg-[var(--paper)]", badge: "bg-[color-mix(in_srgb,var(--harbor)_12%,white)]" };
  if ([45, 48].includes(code)) return { wrap: "bg-[var(--paper)]", badge: "bg-[var(--fog)]" };
  if ([51, 53, 55, 56, 57].includes(code)) return { wrap: "bg-[color-mix(in_srgb,var(--harbor)_6%,white)]", badge: "bg-sky-100" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { wrap: "bg-[color-mix(in_srgb,var(--harbor)_8%,white)]", badge: "bg-sky-100" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { wrap: "bg-[var(--paper)]", badge: "bg-[var(--fog)]" };
  if ([95, 96, 99].includes(code)) return { wrap: "bg-[var(--paper)]", badge: "bg-[color-mix(in_srgb,var(--signal)_16%,white)]" };
  return { wrap: "bg-[var(--paper)]", badge: "bg-[var(--fog)]" };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function WeatherCard({
  locationLabel,
  latitude,
  longitude,
  variant = "card",
}: Props) {
  // default fallback (Richmond)
  const fallback = { label: "Richmond, VA", lat: 37.5407, lon: -77.436 };

  const [coords, setCoords] = useState<{ lat: number; lon: number; label: string }>(() => ({
    lat: latitude ?? fallback.lat,
    lon: longitude ?? fallback.lon,
    label: locationLabel ?? fallback.label,
  }));

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "usingOverride" | "requesting" | "granted" | "denied">("idle");

  // Geolocation: only if no overrides were provided
  useEffect(() => {
    const hasOverride = typeof latitude === "number" && typeof longitude === "number";
    if (hasOverride) {
      setGeoStatus("usingOverride");
      setCoords((c) => ({
        lat: latitude!,
        lon: longitude!,
        label: locationLabel ?? c.label,
      }));
      return;
    }

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("denied");
      return;
    }

    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus("granted");
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: locationLabel ?? "Your location",
        });
      },
      () => {
        // denied / blocked / timeout -> fall back to Richmond
        setGeoStatus("denied");
        setCoords({
          lat: fallback.lat,
          lon: fallback.lon,
          label: locationLabel ?? fallback.label,
        });
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [latitude, longitude, locationLabel]);

  useEffect(() => {
    setWeather(null);

    const url =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${coords.lat}&longitude=${coords.lon}` +
  "&current_weather=true" +
  "&hourly=relative_humidity_2m,dew_point_2m,apparent_temperature" +
  "&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset" +
  "&temperature_unit=fahrenheit" +
  "&windspeed_unit=mph" +
  "&timezone=auto";

    fetch(url)
      .then((res) => res.json())
      .then((data: OpenMeteoResponse) => {
        const cw = data.current_weather;
        if (!cw) return;

        const hourIdx = findHourIndex(data.hourly?.time, cw.time);

        const hum = safeNum(data.hourly?.relative_humidity_2m?.[hourIdx], 0);
        const feelsF = safeNum(data.hourly?.apparent_temperature?.[hourIdx], cw.temperature);
const dewF = safeNum(data.hourly?.dew_point_2m?.[hourIdx], cw.temperature);

// tomorrow (index 1 usually)
const highF = data.daily?.temperature_2m_max?.[1] ?? null;
const lowF = data.daily?.temperature_2m_min?.[1] ?? null;
const tCode = data.daily?.weathercode?.[1] ?? null;

setWeather({
  tempF: safeNum(cw.temperature, 0),
  feelsF,
  windMph: safeNum(cw.windspeed, 0),
  humidity: hum,
  dewpointF: dewF,
  weathercode: safeNum(cw.weathercode, 0),
  sunrise: data.daily?.sunrise?.[0],
  sunset: data.daily?.sunset?.[0],
  tomorrow: { highF, lowF, weathercode: tCode },
});
      })
      .catch(() => {
        // keep null; UI will show a small message
      });
  }, [coords.lat, coords.lon]);

  const emoji = useMemo(
    () => (weather ? weatherEmoji(weather.weathercode) : "🌤️"),
    [weather]
  );

const weatherUrl = `https://forecast.weather.gov/MapClick.php?lat=${coords.lat}&lon=${coords.lon}`;
  
  if (!weather) {
    if (variant === "strip") {
      return (
        <a href={weatherUrl} target="_blank" rel="noreferrer" className="block">
          <div className="rounded-xl border border-white/20 bg-white/15 backdrop-blur-md px-4 py-3">
            <p className="text-sm text-white/80">
              Loading weather{geoStatus === "requesting" ? "…" : "…"}
            </p>
          </div>
        </a>
      );
    }

    return (
      <a href={weatherUrl} target="_blank" rel="noreferrer" className="block">
        <FadeIn>
          <section className="rounded-2xl border border-[var(--fog)] bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-[var(--ink-muted)]">
              Loading weather{geoStatus === "requesting" ? " (getting your location…)" : "…"}
            </p>
          </section>
        </FadeIn>
      </a>
    );
  }

  const label = weatherLabel(weather.weathercode);
  const vibe = vibeClasses(weather.weathercode);

  if (variant === "strip") {
    return (
      <a href={weatherUrl} target="_blank" rel="noreferrer" className="block group">
        <div className="rounded-xl border border-white/20 bg-white/15 backdrop-blur-md px-4 py-3 transition group-hover:bg-white/22">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70 truncate">
                {coords.label}
              </div>
              <div className="text-sm text-white truncate">
                <span className="font-semibold">{Math.round(weather.tempF)}°F</span>{" "}
                <span className="text-white/80">{label}</span>
              </div>
            </div>
            {weather.tomorrow && (
              <div className="text-right shrink-0">
                <div className="text-[11px] uppercase tracking-wider text-white/60">Tomorrow</div>
                <div className="text-sm font-semibold text-white">
                  {Math.round(weather.tomorrow.highF ?? 0)}° / {Math.round(weather.tomorrow.lowF ?? 0)}°
                </div>
              </div>
            )}
          </div>
        </div>
      </a>
    );
  }

  return (
      <a href={weatherUrl} target="_blank" rel="noreferrer" className="block">
    <FadeIn>
      <section
        className={[
          "rounded-2xl border border-[var(--fog)] shadow-sm",
          "px-4 py-3",
          vibe.wrap,
        ].join(" ")}
      >
<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* TOP/LEFT: Current weather + location */}
  <div className="flex items-center gap-3 min-w-0">
    <div
      className={[
        "flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-[var(--fog)]",
        vibe.badge,
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="text-xl">{emoji}</span>
    </div>

    <div className="min-w-0">
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)] truncate">
        Weather · {coords.label}
      </div>
      <div className="text-sm text-[var(--ink-muted)] truncate">
        <span className="font-semibold text-[var(--ink)]">
          {Math.round(weather.tempF)}°F
        </span>{" "}
        <span>({label})</span>
      </div>
    </div>
  </div>

  {/* TOMORROW: full width on mobile, compact on desktop */}
  {weather.tomorrow && (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/60 px-4 py-2 sm:justify-center sm:flex-none">
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {weatherEmoji(weather.tomorrow.weathercode ?? 0)}
        </span>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[var(--ink-muted)]">
            Tomorrow
          </div>
          <div className="text-base font-bold text-[var(--ink)]">
            {Math.round(weather.tomorrow.highF ?? 0)}°
            <span className="mx-1 text-[var(--ink-muted)]">/</span>
            {Math.round(weather.tomorrow.lowF ?? 0)}°
          </div>
        </div>
      </div>
    </div>
  )}

  {/* DETAILS: grid on mobile so it doesn't overflow */}
  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--ink-muted)] sm:flex sm:flex-wrap sm:justify-end sm:text-right">
    <span>
      Feels <span className="font-semibold text-[var(--ink)]">{Math.round(weather.feelsF)}°</span>
    </span>
    <span>
      Dew <span className="font-semibold text-[var(--ink)]">{Math.round(weather.dewpointF)}°</span>
    </span>
    <span>
      Hum <span className="font-semibold text-[var(--ink)]">{Math.round(weather.humidity)}%</span>
    </span>
    <span>
      Wind <span className="font-semibold text-[var(--ink)]">{Math.round(weather.windMph)} mph</span>
    </span>

    {weather.sunrise && weather.sunset && (
      <span className="col-span-2 whitespace-nowrap sm:col-span-1">
        Rise <span className="font-semibold text-[var(--ink)]">{formatTime(weather.sunrise)}</span>{" "}
        · Set <span className="font-semibold text-[var(--ink)]">{formatTime(weather.sunset)}</span>
      </span>
    )}
  </div>
</div>
      </section>
    </FadeIn>
    </a>
  );
}
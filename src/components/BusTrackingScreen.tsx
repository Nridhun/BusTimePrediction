import React, { useState } from 'react';
import { BusTrip } from '../types/transit';
import { LiveTrackingMap } from './LiveTrackingMap';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Navigation,
  Wind,
  Shield,
  CloudSun,
  AlertTriangle
} from 'lucide-react';

interface BusTrackingScreenProps {
  trip: BusTrip;
  onBackToBuses: () => void;
  selectedDateText?: string;
}

export const BusTrackingScreen: React.FC<BusTrackingScreenProps> = ({
  trip,
  onBackToBuses,
  selectedDateText = 'Sun 26 Oct'
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Back to buses button */}
      <div>
        <button
          onClick={onBackToBuses}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to buses</span>
        </button>
      </div>

      {/* Main 2-Column Layout Matching Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Telemetry & Trip Info Panel (Col Span 5) */}
        <div className="lg:col-span-5 bg-[#0a1120] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Top metadata line: Route code on left, Class pill badge on right */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider">
                {trip.routeCode}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-[11px] font-bold font-mono text-blue-300 tracking-wide">
                {trip.serviceClass}
              </span>
            </div>

            {/* Bus ID & Destination Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {trip.id}
              </h1>
              <div className="text-base text-slate-300 font-medium mt-1">
                {trip.origin} <span className="text-cyan-400">→</span> {trip.destination}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-rose-400 mt-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{trip.headingText}</span>
              </div>
            </div>

            {/* Two Distinct Big Status Cards (Matching Screenshot) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pickup Card */}
              <div className="p-4 rounded-2xl bg-[#0e192f] border border-slate-800">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  PICKUP · {trip.pickupStatus.stop}
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mt-1">
                  {trip.pickupStatus.status}
                </div>
              </div>

              {/* Drop Card */}
              <div className="p-4 rounded-2xl bg-[#0e192f] border border-slate-800">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  DROP · {trip.dropStatus.stop}
                </div>
                <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono mt-1">
                  {trip.dropStatus.timeRemaining}
                </div>
              </div>
            </div>

            {/* 6 Metric Tiles in 3-Column Grid (DEPARTURE, ARRIVAL, DURATION, DISTANCE, DELAY/TRAFFIC, WEATHER) */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#080d18] border border-slate-800/80">
              {/* Tile 1: Departure */}
              <div className="p-2 space-y-0.5">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">DEPARTURE</div>
                <div className="text-base font-bold font-mono text-white">{trip.departureTime}</div>
                <div className="text-[10px] font-mono text-slate-500">sch {trip.departureTime}</div>
              </div>

              {/* Tile 2: Arrival */}
              <div className="p-2 space-y-0.5">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">ARRIVAL</div>
                <div className="text-base font-bold font-mono text-cyan-400">{trip.predictedArrival}</div>
                <div className="text-[10px] font-mono text-slate-500">sch {trip.scheduledArrival}</div>
              </div>

              {/* Tile 3: Duration */}
              <div className="p-2 space-y-0.5">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">DURATION</div>
                <div className="text-base font-bold font-mono text-white">{trip.duration}</div>
                <div className="text-[10px] font-mono text-slate-500">sch {trip.duration}</div>
              </div>

              {/* Tile 4: Distance */}
              <div className="p-2 space-y-0.5 border-t border-slate-800/80 pt-2">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">DISTANCE</div>
                <div className="text-base font-bold font-mono text-white">{trip.distanceKm} km</div>
                <div className="text-[10px] font-mono text-slate-500">{trip.stops.length} stops</div>
              </div>

              {/* Tile 5: Delay / Traffic */}
              <div className="p-2 space-y-0.5 border-t border-slate-800/80 pt-2">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">DELAY / TRAFFIC</div>
                <div className="text-base font-bold font-mono text-cyan-400">
                  {trip.delayMinutes > 0 ? `+${trip.delayMinutes} min` : 'On Time'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{trip.trafficStatus}</span>
                </div>
              </div>

              {/* Tile 6: Weather */}
              <div className="p-2 space-y-0.5 border-t border-slate-800/80 pt-2">
                <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">WEATHER</div>
                <div className="text-base font-bold font-mono text-white">{trip.weatherStatus}</div>
                <div className="text-[10px] font-mono text-slate-500">{selectedDateText}</div>
              </div>
            </div>

            {/* Stops on this Trip Timeline (Matching Screenshot) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Navigation className="w-4 h-4 text-cyan-400 rotate-45" />
                <span>Stops on this trip</span>
              </div>

              <div className="space-y-3 pl-1">
                {trip.stops.map((stop, index) => {
                  const isPassed = stop.status === 'passed';
                  const isCurrent = stop.status === 'current';
                  const isSelected = selectedStopId === stop.id;

                  return (
                    <div
                      key={stop.id}
                      onClick={() => setSelectedStopId(stop.id)}
                      className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-800/60' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Indicator */}
                        {isPassed ? (
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                            {index + 1}
                          </div>
                        )}

                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              isCurrent ? 'text-amber-300 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            {stop.name}
                          </div>
                          {index === 0 && (
                            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                              YOUR PICKUP
                            </div>
                          )}
                          {isCurrent && (
                            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                              NEXT DROP STOP
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Scheduled / Actual Times on Right */}
                      <div className="text-right font-mono">
                        <div
                          className={`text-xs font-semibold ${
                            isCurrent ? 'text-amber-300' : isPassed ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {stop.predictedTime}
                        </div>
                        <div className="text-[10px] text-slate-500">sch {stop.scheduledTime}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kozhikode Live Microclimate Footer */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              <span>Calicut Coastal: 29°C · 78% Humidity</span>
            </span>
            <span className="text-cyan-400 font-semibold">96.8% Model Confidence</span>
          </div>
        </div>

        {/* Right High-Detail Interactive Live Map Canvas (Col Span 7) */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[580px]">
          <LiveTrackingMap
            trip={trip}
            onStopSelect={stopId => setSelectedStopId(stopId)}
          />
        </div>
      </div>
    </div>
  );
};

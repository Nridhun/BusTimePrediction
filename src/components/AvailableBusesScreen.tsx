import React, { useState, useMemo } from 'react';
import { BusTrip, ServiceClass } from '../types/transit';
import { BUS_TRIPS, TIME_SLOTS } from '../data/transitData';
import {
  ArrowLeft,
  Navigation,
  Sparkles,
  Clock,
  Filter,
  ArrowUpDown,
  X,
  AlertCircle,
  TrendingUp,
  Info
} from 'lucide-react';

interface AvailableBusesScreenProps {
  searchQuery: {
    origin: string;
    destination: string;
    slotId: number | 'all';
    date: string;
  };
  onBackToSearch: () => void;
  onTrackBus: (trip: BusTrip) => void;
}

export const AvailableBusesScreen: React.FC<AvailableBusesScreenProps> = ({
  searchQuery,
  onBackToSearch,
  onTrackBus
}) => {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [activeSlotFilter, setActiveSlotFilter] = useState<number | 'all'>(searchQuery.slotId);
  const [sortBy, setSortBy] = useState<'departure' | 'duration' | 'delay' | 'fare'>('departure');
  const [selectedTripForML, setSelectedTripForML] = useState<BusTrip | null>(null);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    return BUS_TRIPS.filter(trip => {
      // Service filter
      if (selectedService !== 'all' && trip.serviceClass !== selectedService) {
        return false;
      }
      // Slot filter
      if (activeSlotFilter !== 'all' && trip.departureSlotId !== activeSlotFilter) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (sortBy === 'duration') {
        return a.duration.localeCompare(b.duration);
      }
      if (sortBy === 'delay') {
        return a.delayMinutes - b.delayMinutes;
      }
      if (sortBy === 'fare') {
        return a.fare - b.fare;
      }
      return 0;
    });
  }, [selectedService, activeSlotFilter, sortBy]);

  const getServiceBadgeStyle = (service: ServiceClass) => {
    switch (service) {
      case 'FAST PASSENGER':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'KSRTC SWIFT AC':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'MINNAL DELUXE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'CITY ORDINARY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getDelayBadge = (delayMin: number) => {
    if (delayMin <= 0) {
      return (
        <span className="font-mono text-emerald-400 font-semibold">
          {delayMin < 0 ? `${Math.abs(delayMin)}m Early` : 'On Time'}
        </span>
      );
    }
    if (delayMin <= 3) {
      return (
        <span className="font-mono text-cyan-400 font-semibold">
          +{delayMin} min
        </span>
      );
    }
    return (
      <span className="font-mono text-amber-400 font-semibold">
        +{delayMin} min
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Route Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSearch}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Search</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {searchQuery.origin} <span className="text-cyan-400">→</span> {searchQuery.destination}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400 font-semibold">
                {filteredTrips.length} Buses Found
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
              <span>Date: {searchQuery.date}</span>
              <span>·</span>
              <span>
                Slot:{' '}
                {activeSlotFilter === 'all'
                  ? 'All 24 Hours'
                  : TIME_SLOTS.find(s => s.id === activeSlotFilter)?.label || 'Selected Slot'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Service filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium px-2 py-1 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Services</option>
              <option value="FAST PASSENGER" className="bg-slate-900">Fast Passenger</option>
              <option value="KSRTC SWIFT AC" className="bg-slate-900">KSRTC Swift AC</option>
              <option value="MINNAL DELUXE" className="bg-slate-900">Minnal Deluxe</option>
              <option value="CITY ORDINARY" className="bg-slate-900">City Ordinary</option>
            </select>
          </div>

          {/* Slot filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
            <select
              value={activeSlotFilter}
              onChange={e => setActiveSlotFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-slate-200 text-xs font-mono font-medium px-2 py-1 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All 24 Hours</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot.id} value={slot.id} className="bg-slate-900">
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs font-medium px-2 py-1 outline-none cursor-pointer"
            >
              <option value="departure" className="bg-slate-900">Sort: Departure Time</option>
              <option value="duration" className="bg-slate-900">Sort: Duration</option>
              <option value="delay" className="bg-slate-900">Sort: Least Delay</option>
              <option value="fare" className="bg-slate-900">Sort: Fare (Lowest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggestion 1: 24-Hour Time Slot Carousel Bar */}
      <div className="bg-[#0b1324] border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Select 24-Hour Departure Slot</span>
          </span>
          <span className="text-slate-500 font-mono">1-Hour Slots</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveSlotFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeSlotFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All 24 Hours
          </button>
          {TIME_SLOTS.map(slot => (
            <button
              key={slot.id}
              onClick={() => setActiveSlotFilter(slot.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-colors ${
                activeSlotFilter === slot.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {slot.label.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#0b1324] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#080d19] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Bus & Operator</th>
              <th className="py-3.5 px-4">Service Class</th>
              <th className="py-3.5 px-4">Departure Slot</th>
              <th className="py-3.5 px-4">ML Predicted Arrival</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Delay & Traffic</th>
              <th className="py-3.5 px-4 text-right">Fare</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-white">No buses found for this slot</p>
                    <p className="text-xs text-slate-400">
                      Try selecting another 24-hour time slot or choose "All 24 Hours".
                    </p>
                    <button
                      onClick={() => setActiveSlotFilter('all')}
                      className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-medium"
                    >
                      Show All 24h Departures
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTrips.map(trip => (
                <tr
                  key={trip.id}
                  className="hover:bg-[#0f1b33] transition-colors group"
                >
                  {/* Bus ID & Fleet */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-white group-hover:text-cyan-300 font-mono transition-colors">
                      {trip.id}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[180px]">
                      {trip.operator}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {trip.routeCode}
                    </div>
                  </td>

                  {/* Service Class Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getServiceBadgeStyle(
                        trip.serviceClass
                      )}`}
                    >
                      {trip.serviceClass}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[140px]">
                      via {trip.via}
                    </div>
                  </td>

                  {/* Departure & Slot */}
                  <td className="py-4 px-4">
                    <div className="text-base font-bold font-mono text-white">
                      {trip.departureTime}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Slot: {trip.departureSlot}
                    </div>
                  </td>

                  {/* ML Predicted Arrival */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-cyan-400">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{trip.predictedArrival}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      sch {trip.scheduledArrival}
                    </div>
                  </td>

                  {/* Journey Duration & Distance */}
                  <td className="py-4 px-4 font-mono">
                    <div className="text-slate-200 font-medium">{trip.duration}</div>
                    <div className="text-[11px] text-slate-500">{trip.distanceKm} km</div>
                  </td>

                  {/* Delay & Traffic with ML Breakdown link */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getDelayBadge(trip.delayMinutes)}
                      <span className="text-[11px] text-slate-400">· {trip.trafficStatus}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTripForML(trip)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 mt-0.5"
                    >
                      <Info className="w-3 h-3" />
                      ML Factors Breakdown
                    </button>
                  </td>

                  {/* Fare */}
                  <td className="py-4 px-4 text-right font-mono font-bold text-white">
                    ₹{trip.fare}
                  </td>

                  {/* Action: Track Live Button */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onTrackBus(trip)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Track Live</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="lg:hidden space-y-4">
        {filteredTrips.length === 0 ? (
          <div className="p-8 text-center bg-[#0b1324] border border-slate-800 rounded-2xl">
            <p className="font-semibold text-white">No buses found for this slot</p>
            <p className="text-xs text-slate-400 mt-1">
              Try selecting another 24-hour time slot or choose "All 24 Hours".
            </p>
            <button
              onClick={() => setActiveSlotFilter('all')}
              className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-medium"
            >
              Show All 24h Departures
            </button>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div
              key={trip.id}
              className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg font-mono text-white">{trip.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getServiceBadgeStyle(
                        trip.serviceClass
                      )}`}
                    >
                      {trip.serviceClass}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{trip.operator}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-cyan-400">₹{trip.fare}</div>
                  <div className="text-[11px] font-mono text-slate-500">{trip.distanceKm} km</div>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-center font-mono text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Departure</div>
                  <div className="text-sm font-bold text-white mt-0.5">{trip.departureTime}</div>
                  <div className="text-[10px] text-slate-500">Slot {trip.departureSlotId}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">ML Arrival</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">{trip.predictedArrival}</div>
                  <div className="text-[10px] text-slate-500">sch {trip.scheduledArrival}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">Delay</div>
                  <div className="text-xs font-bold mt-1">{getDelayBadge(trip.delayMinutes)}</div>
                  <div className="text-[10px] text-slate-500">{trip.trafficStatus}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTripForML(trip)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ML Factors</span>
                </button>
                <button
                  onClick={() => onTrackBus(trip)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Track Live</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ML Delay Feature Breakdown Modal / Drawer */}
      {selectedTripForML && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b1324] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-bold text-white">ML Delay Feature Breakdown</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Trip {selectedTripForML.id} · {selectedTripForML.routeCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedTripForML(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Model Confidence & Aggregate Delay */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Predicted Delay</span>
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {selectedTripForML.delayMinutes > 0
                    ? `+${selectedTripForML.delayMinutes} min`
                    : `${selectedTripForML.delayMinutes} min`}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold">Model Confidence</span>
                <div className="text-xl font-bold font-mono text-emerald-400">96.8%</div>
              </div>
            </div>

            {/* Factors List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Contributing Real-Time Factors
              </span>
              {selectedTripForML.mlFactors.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{f.factor}</span>
                    <span
                      className={`font-mono font-bold ${
                        f.impactMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {f.impactMinutes > 0 ? `+${f.impactMinutes} min` : `${f.impactMinutes} min`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{f.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                    <span>Feature Weight: {f.confidence}%</span>
                    <span className="capitalize text-slate-400">Impact: {f.level}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedTripForML(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { KOZHIKODE_HUBS, POPULAR_CORRIDORS, TIME_SLOTS } from '../data/transitData';
import { ArrowRightLeft, Search, Calendar, Clock, MapPin, Sparkles, Bus, ShieldCheck, ChevronRight } from 'lucide-react';

interface WelcomeSearchScreenProps {
  onSearch: (params: { origin: string; destination: string; slotId: number | 'all'; date: string }) => void;
  onSelectCorridor: (corridor: typeof POPULAR_CORRIDORS[0]) => void;
}

export const WelcomeSearchScreen: React.FC<WelcomeSearchScreenProps> = ({
  onSearch,
  onSelectCorridor
}) => {
  const [origin, setOrigin] = useState<string>('Kozhikode');
  const [destination, setDestination] = useState<string>('Vadakara');
  const [selectedSlotId, setSelectedSlotId] = useState<number | 'all'>(9); // 09:00 AM - 10:00 AM default
  
  // Dynamic today's date
  const today = new Date();
  const formatDateISO = (d: Date) => d.toISOString().split('T')[0];
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const [dateValue, setDateValue] = useState<string>(formatDateISO(today));

  // Swap origin and destination with smooth feedback
  const [isSwapping, setIsSwapping] = useState(false);
  const handleSwap = () => {
    setIsSwapping(true);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setTimeout(() => setIsSwapping(false), 200);
  };

  // Quick preset shortcuts
  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDateValue(formatDateISO(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      slotId: selectedSlotId,
      date: dateValue
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Hero Visual Section: Scenic Kerala Dawn Backwaters with Dark Navy & Cyan Scrim */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#070d19] shadow-2xl">
        {/* Artistic Kerala Dawn Backwaters Vector Art & Scrim */}
        <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden">
          {/* Dawn Sky & Water SVG Artwork */}
          <svg
            viewBox="0 0 1440 400"
            className="w-full h-full object-cover select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Dawn Sky Gradient: Deep Indigo to Golden-Cyan Dawn */}
              <linearGradient id="dawnSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#050a16" />
                <stop offset="45%" stopColor="#0b1e3b" />
                <stop offset="85%" stopColor="#133d59" />
                <stop offset="100%" stopColor="#1e586b" />
              </linearGradient>

              {/* Water Reflection Gradient */}
              <linearGradient id="backwaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#11374d" />
                <stop offset="40%" stopColor="#0a2238" />
                <stop offset="100%" stopColor="#040b17" />
              </linearGradient>

              <radialGradient id="sunGlow" cx="65%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sky Background */}
            <rect width="1440" height="260" fill="url(#dawnSky)" />
            <circle cx="940" cy="190" r="220" fill="url(#sunGlow)" />

            {/* Distant Misty Backwater Islands */}
            <path
              d="M 0 240 Q 360 210 720 235 T 1440 225 L 1440 260 L 0 260 Z"
              fill="#0d2b42"
              opacity="0.6"
            />
            <path
              d="M 0 250 Q 280 230 680 245 T 1440 240 L 1440 260 L 0 260 Z"
              fill="#091b2c"
              opacity="0.9"
            />

            {/* Backwater Water Surface */}
            <rect y="260" width="1440" height="140" fill="url(#backwaterGrad)" />

            {/* Ripples on Backwater */}
            <path d="M 120 290 Q 320 293 520 290" stroke="#38bdf8" strokeWidth="1" opacity="0.3" fill="none" />
            <path d="M 680 310 Q 880 313 1080 310" stroke="#38bdf8" strokeWidth="1" opacity="0.25" fill="none" />
            <path d="M 400 340 Q 640 343 920 340" stroke="#00f5ff" strokeWidth="1.2" opacity="0.35" fill="none" />

            {/* Silhouette of Kerala Traditional Kettuvallam (Houseboat) at Dawn */}
            <g transform="translate(860, 215) scale(0.65)" opacity="0.85">
              {/* Houseboat hull */}
              <path
                d="M 10 70 Q 120 85 240 70 L 235 55 Q 120 62 15 55 Z"
                fill="#050a12"
              />
              {/* Houseboat thatched curved bamboo roof */}
              <path
                d="M 40 55 Q 120 20 200 55 Z"
                fill="#07101c"
              />
              {/* Boat reflection */}
              <ellipse cx="125" cy="78" rx="100" ry="8" fill="#03070d" opacity="0.6" />
            </g>

            {/* Silhouettes of Kerala Coconut Palm Trees along the Banks */}
            <g transform="translate(1180, 70) scale(0.85)" opacity="0.9">
              {/* Palm trunk 1 */}
              <path d="M 60 210 Q 75 140 100 80" stroke="#040810" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Palm Fronds */}
              <path d="M 100 80 Q 50 50 10 80" stroke="#040810" strokeWidth="3" fill="none" />
              <path d="M 100 80 Q 70 30 40 10" stroke="#040810" strokeWidth="3" fill="none" />
              <path d="M 100 80 Q 120 20 160 40" stroke="#040810" strokeWidth="3" fill="none" />
              <path d="M 100 80 Q 150 60 180 90" stroke="#040810" strokeWidth="3" fill="none" />
              <path d="M 100 80 Q 130 100 150 130" stroke="#040810" strokeWidth="3" fill="none" />
            </g>

            <g transform="translate(60, 90) scale(0.75)" opacity="0.85">
              <path d="M 80 200 Q 65 130 50 70" stroke="#040810" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              <path d="M 50 70 Q 20 50 -10 70" stroke="#040810" strokeWidth="2.5" fill="none" />
              <path d="M 50 70 Q 40 20 20 0" stroke="#040810" strokeWidth="2.5" fill="none" />
              <path d="M 50 70 Q 80 30 110 50" stroke="#040810" strokeWidth="2.5" fill="none" />
              <path d="M 50 70 Q 90 80 120 100" stroke="#040810" strokeWidth="2.5" fill="none" />
            </g>
          </svg>

          {/* Deep Navy & Cyan Gradient Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-transparent to-[#080d1a]/80" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>KOZHIKODE TRANSIT INTELLIGENCE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-normal">Real-Time Bus Tracking & ML Delays</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Smarter Journeys Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">Kozhikode & Malabar</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl">
              Live bus locations, 24-hour departure slots, and ML-predicted arrivals along NH 66, Mavoor Road, and Calicut transit corridors.
            </p>
          </div>
        </div>

        {/* Trip Planner Input Card (Elevated & Integrated) */}
        <div className="p-6 sm:p-8 bg-[#0b1324] border-t border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Origin, Swap, Destination */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
              {/* Origin Picker */}
              <div className="lg:col-span-5 relative">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Starting Stop</span>
                </label>
                <div className="relative">
                  <select
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                  >
                    {KOZHIKODE_HUBS.map(hub => (
                      <option key={hub} value={hub} className="bg-slate-900 text-white">
                        {hub}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Instant Swap Button */}
              <div className="lg:col-span-1 flex justify-center pt-5 sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Starting and Destination Stops"
                  className={`p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 ${
                    isSwapping ? 'rotate-180 transition-transform duration-200' : ''
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Picker */}
              <div className="lg:col-span-5 relative">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Destination Stop</span>
                </label>
                <div className="relative">
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                  >
                    {KOZHIKODE_HUBS.map(hub => (
                      <option key={hub} value={hub} className="bg-slate-900 text-white">
                        {hub}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 24-Hour Departure Slot & Automatic Date Picker (User Suggestion 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Suggestion 1: 24-Hour Time Slot Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Departure Time Slot (24-Hour Range)</span>
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400/90">Slot Format: 2.00 AM - 3.00 AM</span>
                </div>

                <div className="relative">
                  <select
                    value={selectedSlotId}
                    onChange={e => setSelectedSlotId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">Any Departure Time (All 24 Hours)</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.id} value={slot.id} className="bg-slate-900 text-slate-100">
                        {slot.label} ({slot.period})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>

                {/* Quick Slot Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSlotId('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedSlotId === 'all'
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All 24h
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlotId(2)} // 02:00 AM - 03:00 AM
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSlotId === 2
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    02:00 AM - 03:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlotId(8)} // 08:00 AM - 09:00 AM
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSlotId === 8
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    08:00 AM - 09:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlotId(9)} // 09:00 AM - 10:00 AM
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSlotId === 9
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    09:00 AM - 10:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlotId(14)} // 02:00 PM - 03:00 PM
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      selectedSlotId === 14
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    02:00 PM - 03:00 PM
                  </button>
                </div>
              </div>

              {/* Suggestion 1: Automatic Date with Optional Custom Change */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Travel Date (Auto-Initialized)</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">
                    {dateValue === formatDateISO(today) ? '• Today Selected' : '• Custom Date'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    value={dateValue}
                    onChange={e => setDateValue(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 font-medium text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none cursor-pointer"
                  />
                </div>

                {/* Date Quick Toggles */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setQuickDate(0)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      dateValue === formatDateISO(today)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(1)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    Tomorrow
                  </button>
                  <span className="text-slate-500 text-[11px] font-mono">
                    Formatted: {formatDateDisplay(dateValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <Search className="w-5 h-5 text-slate-950" />
                <span>Search Available Buses ({origin} → {destination})</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Corridor Cards: Popular Kozhikode Routes (1-Click Query) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Bus className="w-5 h-5 text-cyan-400" />
              <span>Frequent Corridors in Kozhikode</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant 1-click query execution for prime commuter routes
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">5 High-Volume Lines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_CORRIDORS.map(corridor => (
            <div
              key={corridor.id}
              onClick={() => onSelectCorridor(corridor)}
              className="p-5 rounded-2xl bg-[#0b1324] hover:bg-[#0f1a30] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-cyan-400 font-semibold">{corridor.tag}</span>
                  <span className="text-slate-500 font-mono">{corridor.frequency}</span>
                </div>

                <div className="flex items-center gap-2 text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  <span>{corridor.from}</span>
                  <span className="text-cyan-500">→</span>
                  <span>{corridor.to}</span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{corridor.distance}</span>
                  <span className="text-slate-600">·</span>
                  <span>{corridor.duration}</span>
                  <span className="text-slate-600">·</span>
                  <span>{corridor.busesCount} trips</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Live GPS Active
                </span>
                <span className="text-cyan-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

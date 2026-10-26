/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusTrip } from './types/transit';
import { BUS_TRIPS, POPULAR_CORRIDORS } from './data/transitData';
import { WelcomeSearchScreen } from './components/WelcomeSearchScreen';
import { AvailableBusesScreen } from './components/AvailableBusesScreen';
import { BusTrackingScreen } from './components/BusTrackingScreen';
import { ShowcaseAllScreen } from './components/ShowcaseAllScreen';
import { Bus, Layers, Search, Navigation, ListFilter, Calendar } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'search' | 'list' | 'track' | 'showcase'>('track');
  
  // Active selected trip (defaults to BUS031 matching the user's reference screenshot)
  const [activeTrip, setActiveTrip] = useState<BusTrip>(BUS_TRIPS[0]);

  // Dynamic automatic today's date
  const today = new Date();
  const formatDateISO = (d: Date) => d.toISOString().split('T')[0];
  const formatDateShort = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  const [travelDate, setTravelDate] = useState<string>(formatDateISO(today));
  const [formattedDateText, setFormattedDateText] = useState<string>(formatDateShort(today));

  // Search parameters
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    slotId: number | 'all';
    date: string;
  }>({
    origin: 'Kozhikode',
    destination: 'Vadakara',
    slotId: 9, // 09:00 AM - 10:00 AM (BUS031)
    date: formatDateISO(today)
  });

  const handleSearch = (params: { origin: string; destination: string; slotId: number | 'all'; date: string }) => {
    setSearchParams(params);
    setTravelDate(params.date);
    const parsed = new Date(params.date);
    if (!isNaN(parsed.getTime())) {
      setFormattedDateText(formatDateShort(parsed));
    }
    setCurrentScreen('list');
  };

  const handleSelectCorridor = (corridor: typeof POPULAR_CORRIDORS[0]) => {
    setSearchParams({
      origin: corridor.from,
      destination: corridor.to,
      slotId: 'all',
      date: travelDate
    });
    // Find matching bus
    const match = BUS_TRIPS.find(b => b.id === corridor.busId) || BUS_TRIPS[0];
    setActiveTrip(match);
    setCurrentScreen('list');
  };

  const handleTrackBus = (trip: BusTrip) => {
    setActiveTrip(trip);
    setCurrentScreen('track');
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header Bar */}
      <header className="sticky top-0 z-40 bg-[#070c17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Stats Block (Matching user's reference image header) */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <div
              onClick={() => setCurrentScreen('search')}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shadow-sm shadow-cyan-500/20">
                <Bus className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                KozhiBus <span className="text-cyan-400">Live</span>
              </span>
            </div>

            {/* Quick Live Trip Status pill matching reference image */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>40 trips</span>
              <span className="text-slate-600">·</span>
              <span>24 buses</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">{formattedDateText}</span>
            </div>
          </div>

          {/* Screen Switcher Tabs & Showcase Mode (Direct top navigation selector) */}
          <nav className="flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setCurrentScreen('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                currentScreen === 'search'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Welcome & Search</span>
            </button>

            <button
              onClick={() => setCurrentScreen('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                currentScreen === 'list'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>2. Available Buses</span>
            </button>

            <button
              onClick={() => setCurrentScreen('track')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                currentScreen === 'track'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>3. Bus Tracking</span>
            </button>

            <div className="w-[1px] h-4 bg-slate-800 mx-1" />

            <button
              onClick={() => setCurrentScreen('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                currentScreen === 'showcase'
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-md shadow-cyan-400/30'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Showcase All 3</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 pb-12">
        {currentScreen === 'search' && (
          <WelcomeSearchScreen
            onSearch={handleSearch}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {currentScreen === 'list' && (
          <AvailableBusesScreen
            searchQuery={searchParams}
            onBackToSearch={() => setCurrentScreen('search')}
            onTrackBus={handleTrackBus}
          />
        )}

        {currentScreen === 'track' && (
          <BusTrackingScreen
            trip={activeTrip}
            onBackToBuses={() => setCurrentScreen('list')}
            selectedDateText={formattedDateText}
          />
        )}

        {currentScreen === 'showcase' && (
          <ShowcaseAllScreen
            onSelectScreen={setCurrentScreen}
            activeTrip={activeTrip}
            searchQuery={searchParams}
            onSearch={handleSearch}
            onSelectCorridor={handleSelectCorridor}
            onTrackBus={handleTrackBus}
            selectedDateText={formattedDateText}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070c17] py-4 px-4 sm:px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Kozhikode Bus Tracking & Transit Intelligence · KSRTC & Private Carriers</span>
          <span className="text-slate-400">Real-Time ML Delay Prediction Engine</span>
        </div>
      </footer>
    </div>
  );
}

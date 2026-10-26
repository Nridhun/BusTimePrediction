import React from 'react';
import { BusTrip } from '../types/transit';
import { WelcomeSearchScreen } from './WelcomeSearchScreen';
import { AvailableBusesScreen } from './AvailableBusesScreen';
import { BusTrackingScreen } from './BusTrackingScreen';
import { Layers, ArrowRight, Eye } from 'lucide-react';

interface ShowcaseAllScreenProps {
  onSelectScreen: (screen: 'search' | 'list' | 'track') => void;
  activeTrip: BusTrip;
  searchQuery: {
    origin: string;
    destination: string;
    slotId: number | 'all';
    date: string;
  };
  onSearch: (params: any) => void;
  onSelectCorridor: (corridor: any) => void;
  onTrackBus: (trip: BusTrip) => void;
  selectedDateText: string;
}

export const ShowcaseAllScreen: React.FC<ShowcaseAllScreenProps> = ({
  onSelectScreen,
  activeTrip,
  searchQuery,
  onSearch,
  onSelectCorridor,
  onTrackBus,
  selectedDateText
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Showcase Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0b1324] border border-cyan-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Showcase Mode · Triple-Screen Interface Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Complete KozhiBus Live UI Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review all 3 high-fidelity screens: Search with 24h slots, Available Buses with ML breakdown, and Real-Time Bus Map with realistic animated bus marker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectScreen('track')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <span>Open Bus Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen 1 Showcase Block */}
      <div className="rounded-3xl border border-slate-800 bg-[#080d18] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a1120]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              1
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Screen 1: Welcome & Search Page</h3>
              <p className="text-[11px] text-slate-400">
                Kerala backwaters dawn hero, starting/destination swap, 24-hour departure slots, auto date
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectScreen('search')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Maximize Screen 1</span>
          </button>
        </div>
        <div className="p-4 sm:p-6 opacity-95 hover:opacity-100 transition-opacity">
          <WelcomeSearchScreen
            onSearch={params => {
              onSearch(params);
              onSelectScreen('list');
            }}
            onSelectCorridor={corridor => {
              onSelectCorridor(corridor);
              onSelectScreen('list');
            }}
          />
        </div>
      </div>

      {/* Screen 2 Showcase Block */}
      <div className="rounded-3xl border border-slate-800 bg-[#080d18] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a1120]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              2
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Screen 2: Available Buses Page</h3>
              <p className="text-[11px] text-slate-400">
                Desktop table view, mobile cards, 24h slot filters, ML delay factors modal, direct tracking launch
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectScreen('list')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Maximize Screen 2</span>
          </button>
        </div>
        <div className="p-4 sm:p-6 opacity-95 hover:opacity-100 transition-opacity">
          <AvailableBusesScreen
            searchQuery={searchQuery}
            onBackToSearch={() => onSelectScreen('search')}
            onTrackBus={trip => {
              onTrackBus(trip);
              onSelectScreen('track');
            }}
          />
        </div>
      </div>

      {/* Screen 3 Showcase Block */}
      <div className="rounded-3xl border border-slate-800 bg-[#080d18] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a1120]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              3
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Screen 3: Bus Tracking Page</h3>
              <p className="text-[11px] text-slate-400">
                Exact reference image replica: Left telemetry cards, stops timeline, and high-fidelity live animated bus marker
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectScreen('track')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Maximize Screen 3</span>
          </button>
        </div>
        <div className="p-4 sm:p-6 opacity-95 hover:opacity-100 transition-opacity">
          <BusTrackingScreen
            trip={activeTrip}
            onBackToBuses={() => onSelectScreen('list')}
            selectedDateText={selectedDateText}
          />
        </div>
      </div>
    </div>
  );
};

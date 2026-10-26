import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BusTrip } from '../types/transit';
import { BusMarker } from './BusMarker';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Radio, Compass, ZoomIn, ZoomOut } from 'lucide-react';

interface LiveTrackingMapProps {
  trip: BusTrip;
  onStopSelect?: (stopId: string) => void;
}

// Cubic spline or piecewise linear interpolation with angle calculation
interface Point {
  x: number;
  y: number;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ trip, onStopSelect }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(30); // Default 30x like reference image!
  const [progress, setProgress] = useState<number>(0.54); // Positioned between Chemancheri and Koyilandy like reference
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Time ticker for simulated or IST clock
  const [clockTime, setClockTime] = useState<string>('09:01:04 IST');

  // Build the route coordinates from the trip's stops
  const routePoints: Point[] = useMemo(() => {
    return trip.stops.map(s => ({ x: s.x, y: s.y }));
  }, [trip.stops]);

  // Compute cumulative segment lengths
  const segmentLengths = useMemo(() => {
    const lengths: number[] = [];
    let total = 0;
    for (let i = 0; i < routePoints.length - 1; i++) {
      const p1 = routePoints[i];
      const p2 = routePoints[i + 1];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      lengths.push(d);
      total += d;
    }
    return { lengths, total };
  }, [routePoints]);

  // Compute exact position and tangent angle for current progress [0, 1]
  const currentBusState = useMemo(() => {
    if (routePoints.length < 2) return { x: 750, y: 650, angle: 0, speed: 48 };

    const targetDistance = progress * segmentLengths.total;
    let accumulated = 0;
    let segIndex = 0;
    let segRatio = 0;

    for (let i = 0; i < segmentLengths.lengths.length; i++) {
      const segLen = segmentLengths.lengths[i];
      if (accumulated + segLen >= targetDistance || i === segmentLengths.lengths.length - 1) {
        segIndex = i;
        segRatio = segLen > 0 ? (targetDistance - accumulated) / segLen : 0;
        break;
      }
      accumulated += segLen;
    }

    const p1 = routePoints[segIndex];
    const p2 = routePoints[segIndex + 1] || p1;

    // Linear interpolation along this segment
    const x = p1.x + (p2.x - p1.x) * segRatio;
    const y = p1.y + (p2.y - p1.y) * segRatio;

    // Tangent angle in degrees (+90 because vehicle SVG points upwards)
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angleDeg = (angleRad * 180) / Math.PI + 90;

    // Dynamic speed simulation
    const baseSpeed = 46;
    const variation = Math.sin(progress * 20) * 8;
    const speed = Math.max(25, Math.min(65, baseSpeed + variation));

    return { x, y, angle: angleDeg, speed };
  }, [progress, routePoints, segmentLengths]);

  // Animation loop with requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        // Base trip takes 60 seconds at 1x; speedMultiplier accelerates it
        const progressIncrement = (dt / 90) * speedMultiplier;
        setProgress(prev => {
          const next = prev + progressIncrement;
          if (next >= 1) {
            return 0; // Loop or loop back to start
          }
          return next;
        });

        // Update simulated clock based on trip duration and progress
        const startH = 9;
        const startM = 0;
        const totalDurationSec = 84 * 60; // 1h 24m
        const currentTripSec = progress * totalDurationSec;
        const currentH = Math.floor(startH + currentTripSec / 3600);
        const currentM = Math.floor((currentTripSec % 3600) / 60);
        const currentS = Math.floor(currentTripSec % 60);
        const pad = (n: number) => n.toString().padStart(2, '0');
        setClockTime(`${pad(currentH)}:${pad(currentM)}:${pad(currentS)} IST`);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speedMultiplier, progress]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Center on Bus
  const centerOnBus = () => {
    setZoomLevel(1.3);
    setPanOffset({
      x: (500 - currentBusState.x) * 0.4,
      y: (500 - currentBusState.y) * 0.4
    });
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] bg-[#080d18] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col select-none"
    >
      {/* Top Map HUD Bar (Matching reference image) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mode Pill: e.g. REPLAY 30X or LIVE */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-400 shadow-lg tracking-wider">
            {isLiveMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">LIVE GPS</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono">REPLAY {speedMultiplier}X</span>
              </>
            )}
          </div>

          {/* IST Time readout */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs font-mono font-medium text-slate-300 shadow-lg tabular-nums">
            {clockTime}
          </div>
        </div>

        {/* Top Right Map Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={centerOnBus}
            title="Center on Bus"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md transition-colors"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.min(2.2, z + 0.2))}
            title="Zoom In"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.2))}
            title="Zoom Out"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 backdrop-blur-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main SVG Vector Transit Cartography Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '50% 50%'
          }}
        >
          <defs>
            {/* Neon Glow Filter for Cyan Route */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Headlight Projection Beam Gradient */}
            <linearGradient id="headlightBeam" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>

            {/* Arabian Sea Water Gradient */}
            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#040914" />
              <stop offset="60%" stopColor="#071224" />
              <stop offset="100%" stopColor="#0a1a33" />
            </linearGradient>

            {/* Landmass Shading */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080e1a" />
              <stop offset="50%" stopColor="#0a1222" />
              <stop offset="100%" stopColor="#0d182e" />
            </linearGradient>
          </defs>

          {/* Background: Base Canvas */}
          <rect width="1000" height="1000" fill="url(#landGradient)" />

          {/* Topographic Water / Arabian Sea on Western Coast */}
          <path
            d="M 0 0 L 520 0 Q 510 180 540 320 T 590 540 Q 640 680 670 820 L 680 1000 L 0 1000 Z"
            fill="url(#seaGradient)"
            opacity="0.85"
          />

          {/* Gentle Sea Waves & Contour Coastline lines */}
          <path
            d="M 0 120 Q 250 140 515 150"
            stroke="#0e2444"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            fill="none"
          />
          <path
            d="M 0 340 Q 300 360 550 380"
            stroke="#0e2444"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            fill="none"
          />
          <path
            d="M 0 620 Q 340 640 620 660"
            stroke="#0e2444"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            fill="none"
          />
          <text
            x="140"
            y="480"
            fill="#1e3a5f"
            fontSize="18"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="700"
            letterSpacing="6"
            opacity="0.5"
            transform="rotate(-75 140 480)"
          >
            ARABIAN SEA (LAKSHADWEEP SEA)
          </text>

          {/* Coastal Shoreline Contour Polyline */}
          <path
            d="M 520 0 Q 510 180 540 320 T 590 540 Q 640 680 670 820 L 680 1000"
            stroke="#163860"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Kozhikode Urban Road Network Grid (Dark slate subtle network) */}
          <g opacity="0.35">
            {/* NH 66 Parallel Bypass Arterials */}
            <path d="M 680 100 L 730 450 L 780 720 L 860 1000" stroke="#1e293b" strokeWidth="8" fill="none" />
            <path d="M 680 100 L 730 450 L 780 720 L 860 1000" stroke="#334155" strokeWidth="1.5" fill="none" />

            {/* Mavoor Road to Medical College & Kunnamangalam */}
            <path d="M 790 810 L 870 780 L 960 760" stroke="#1e293b" strokeWidth="7" fill="none" />
            <path d="M 790 810 L 870 780 L 960 760" stroke="#334155" strokeWidth="1.5" fill="none" />

            {/* Mini Bypass connecting Thondayad to Puthiyangadi */}
            <path d="M 820 800 L 780 710 L 740 640" stroke="#1e293b" strokeWidth="5" fill="none" />

            {/* Wayanad Road (NH 766) towards Thamarassery */}
            <path d="M 870 780 L 990 680" stroke="#1e293b" strokeWidth="5" fill="none" />

            {/* Feroke & Ramanattukara South Corridor */}
            <path d="M 790 810 L 820 880 L 860 970" stroke="#1e293b" strokeWidth="6" fill="none" />

            {/* Secondary Town Roads */}
            <path d="M 610 270 L 740 250" stroke="#1e293b" strokeWidth="3" fill="none" />
            <path d="M 640 405 L 750 410" stroke="#1e293b" strokeWidth="3" fill="none" />
            <path d="M 710 520 L 820 530" stroke="#1e293b" strokeWidth="3" fill="none" />
            <path d="M 750 680 L 830 670" stroke="#1e293b" strokeWidth="3" fill="none" />
            <path d="M 790 810 L 720 830" stroke="#1e293b" strokeWidth="3" fill="none" />
          </g>

          {/* Active Bus Route Polyline (Glowing Neon Cyan) */}
          <g filter="url(#cyanGlow)">
            {/* Outer Cyan Soft Halo Line */}
            <polyline
              points={routePoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#00f5ff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            {/* Inner Vibrant Core Cyan Line */}
            <polyline
              points={routePoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
          </g>

          {/* Stop Nodes & Text Labels (Matching reference image) */}
          {trip.stops.map((stop, idx) => {
            const isTarget = stop.status === 'current';
            const isPassed = stop.status === 'passed';

            return (
              <g
                key={stop.id}
                className="cursor-pointer group"
                onClick={() => onStopSelect && onStopSelect(stop.id)}
              >
                {/* Halo around current active target stop */}
                {isTarget && (
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="12"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Stop Node Dot */}
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r={isTarget ? 6.5 : 5}
                  fill={isTarget ? '#00f5ff' : isPassed ? '#38bdf8' : '#1e293b'}
                  stroke={isTarget ? '#ffffff' : '#080d18'}
                  strokeWidth="2"
                  filter="drop-shadow(0 0 6px rgba(0, 245, 255, 0.8))"
                />

                {/* Stop Typography Label */}
                <g transform={`translate(${stop.x + 14}, ${stop.y + 4})`}>
                  {/* Subtle dark backing pill for text contrast */}
                  <rect
                    x="-4"
                    y="-12"
                    width={stop.name.length * 8 + 10}
                    height="18"
                    rx="4"
                    fill="#080e1ac0"
                    stroke="#1e293b80"
                    strokeWidth="0.8"
                    className="backdrop-blur-sm"
                  />
                  <text
                    x="0"
                    y="0"
                    fill={isTarget ? '#00f5ff' : '#cbd5e1'}
                    fontSize="11.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight={isTarget ? '700' : '500'}
                    className="group-hover:fill-cyan-300 transition-colors"
                  >
                    {stop.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* The High-Detail Moving Bus Marker */}
          <BusMarker
            x={currentBusState.x}
            y={currentBusState.y}
            headingAngle={currentBusState.angle}
            speedKmH={currentBusState.speed}
            serviceClass={trip.serviceClass}
            busNumber={trip.id.replace('BUS', '')}
            isLive={isPlaying}
          />
        </svg>
      </div>

      {/* Bottom Playback & Scrubber Controls (Matching user screenshot) */}
      <div className="relative z-20 px-4 py-3 bg-[#0a1120]/95 backdrop-blur-md border-t border-slate-800 flex flex-col gap-2">
        {/* Progress Scrubber Slider */}
        <div className="relative w-full flex items-center group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={e => {
              setProgress(parseFloat(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          {/* Stop pip markers along progress scrubber */}
          <div className="absolute inset-x-0 pointer-events-none flex justify-between px-1">
            {trip.stops.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-slate-600"
                style={{ opacity: i / (trip.stops.length - 1) <= progress ? 1 : 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Lower Action Row */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <div className="flex items-center gap-3">
            {/* Live Toggle */}
            <button
              onClick={() => {
                setIsLiveMode(!isLiveMode);
                if (!isLiveMode) {
                  setSpeedMultiplier(1);
                  setIsPlaying(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                isLiveMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live</span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Restart */}
            <button
              onClick={() => {
                setProgress(0);
                setIsPlaying(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          {/* Speed Multipliers (1x, 10x, 30x, 60x - matching screenshot) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
            {[1, 10, 30, 60].map(multiplier => (
              <button
                key={multiplier}
                onClick={() => {
                  setSpeedMultiplier(multiplier);
                  setIsLiveMode(multiplier === 1);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                  speedMultiplier === multiplier
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {multiplier}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

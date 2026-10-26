import React from 'react';

interface BusMarkerProps {
  x: number;
  y: number;
  headingAngle: number; // degrees
  speedKmH?: number;
  serviceClass?: string;
  busNumber?: string;
  isLive?: boolean;
}

export const BusMarker: React.FC<BusMarkerProps> = ({
  x,
  y,
  headingAngle,
  speedKmH = 46,
  serviceClass = 'FAST PASSENGER',
  busNumber = '31',
  isLive = true
}) => {
  // Determine livery accent color
  const isSwift = serviceClass.includes('SWIFT');
  const isMinnal = serviceClass.includes('MINNAL');
  
  const liveryColor = isSwift ? '#00f5ff' : isMinnal ? '#f59e0b' : '#38bdf8';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="pointer-events-none select-none transition-transform duration-75 ease-out"
    >
      {/* Radar telemetry wave for active bus */}
      {isLive && (
        <circle
          r="38"
          fill="none"
          stroke={liveryColor}
          strokeWidth="1.2"
          opacity="0.3"
          className="animate-ping"
          style={{ transformOrigin: '0 0' }}
        />
      )}

      {/* Ground ambient drop shadow */}
      <ellipse
        cx="0"
        cy="4"
        rx="26"
        ry="14"
        fill="rgba(0, 0, 0, 0.7)"
        filter="blur(4px)"
      />

      {/* Rotating Bus Chassis based on mathematical road heading angle */}
      <g transform={`rotate(${headingAngle})`}>
        {/* Forward Headlight Beams (Casting light onto dark roadway) */}
        <path
          d="M -10 -24 L -24 -90 L 24 -90 L 10 -24 Z"
          fill="url(#headlightBeam)"
          opacity="0.55"
        />

        {/* Side Mirrors */}
        <rect x="-17" y="-18" width="4" height="6" rx="1.5" fill="#1e293b" stroke="#0ea5e9" strokeWidth="0.8" />
        <rect x="13" y="-18" width="4" height="6" rx="1.5" fill="#1e293b" stroke="#0ea5e9" strokeWidth="0.8" />

        {/* Main Bus Body Chassis */}
        <rect
          x="-14"
          y="-25"
          width="28"
          height="54"
          rx="6"
          fill="#0c1729"
          stroke={liveryColor}
          strokeWidth="1.8"
          filter="drop-shadow(0 2px 8px rgba(0, 245, 255, 0.4))"
        />

        {/* Front Curved Windshield Glass */}
        <path
          d="M -11 -16 Q 0 -22 11 -16 L 10 -22 Q 0 -24 -10 -22 Z"
          fill="#38bdf8"
          opacity="0.9"
        />

        {/* Front Cabin & Dashboard */}
        <rect
          x="-10"
          y="-15"
          width="20"
          height="7"
          rx="2"
          fill="#1e3a5f"
          opacity="0.85"
        />

        {/* Side Passenger Windows */}
        <g opacity="0.8">
          <rect x="-12" y="-6" width="3" height="6" rx="0.8" fill="#38bdf8" />
          <rect x="-12" y="3" width="3" height="6" rx="0.8" fill="#38bdf8" />
          <rect x="-12" y="12" width="3" height="6" rx="0.8" fill="#38bdf8" />

          <rect x="9" y="-6" width="3" height="6" rx="0.8" fill="#38bdf8" />
          <rect x="9" y="3" width="3" height="6" rx="0.8" fill="#38bdf8" />
          <rect x="9" y="12" width="3" height="6" rx="0.8" fill="#38bdf8" />
        </g>

        {/* Roof Air Conditioning Chiller Unit */}
        <rect
          x="-7"
          y="-3"
          width="14"
          height="14"
          rx="2"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="0.8"
        />
        {/* AC Vent louvers */}
        <line x1="-5" y1="1" x2="5" y2="1" stroke="#64748b" strokeWidth="0.6" />
        <line x1="-5" y1="4" x2="5" y2="4" stroke="#64748b" strokeWidth="0.6" />
        <line x1="-5" y1="7" x2="5" y2="7" stroke="#64748b" strokeWidth="0.6" />

        {/* Roof Fleet Number Badge */}
        <text
          x="0"
          y="-7"
          fill="#f8fafc"
          fontSize="6.5"
          fontWeight="800"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(90)"
        >
          {busNumber}
        </text>

        {/* Front Twin High-Intensity Headlamps */}
        <circle cx="-9" cy="-24" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #00f5ff)" />
        <circle cx="9" cy="-24" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #00f5ff)" />

        {/* Rear Red LED Brake / Tail Lights */}
        <rect x="-11" y="27" width="5" height="2" rx="0.8" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
        <rect x="6" y="27" width="5" height="2" rx="0.8" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />

        {/* Speedometer indicator chip behind bus */}
        <g transform="translate(0, 36) scale(0.9)">
          <rect
            x="-18"
            y="-6"
            width="36"
            height="12"
            rx="4"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          <text
            x="0"
            y="0"
            fill="#00f5ff"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {Math.round(speedKmH)} km/h
          </text>
        </g>
      </g>
    </g>
  );
};

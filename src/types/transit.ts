export type ServiceClass = 
  | 'FAST PASSENGER' 
  | 'KSRTC SWIFT AC' 
  | 'CITY ORDINARY' 
  | 'MINNAL DELUXE' 
  | 'PRIVATE STAGE';

export interface RouteStop {
  id: string;
  name: string;
  shortName?: string;
  x: number; // Normalized coordinate 0-1000 for map
  y: number; // Normalized coordinate 0-1000 for map
  scheduledTime: string;
  predictedTime: string;
  distanceKm: number;
  status: 'passed' | 'current' | 'upcoming';
  platform?: string;
}

export interface MLDelayFactor {
  factor: string;
  impactMinutes: number;
  confidence: number;
  description: string;
  level: 'low' | 'moderate' | 'high';
}

export interface BusTrip {
  id: string; // e.g. "BUS031"
  routeCode: string; // e.g. "R002 · T033800"
  operator: string; // e.g. "KSRTC Malabar Division"
  serviceClass: ServiceClass;
  origin: string; // "Kozhikode"
  destination: string; // "Vadakara"
  via: string;
  departureTime: string; // "09:00"
  departureSlot: string; // "09:00 AM - 10:00 AM"
  departureSlotId: number; // 0 to 23
  scheduledArrival: string; // "10:23"
  predictedArrival: string; // "10:24"
  duration: string; // "1h 24m"
  distanceKm: number; // 48
  delayMinutes: number; // +1
  trafficStatus: 'Low' | 'Moderate' | 'Heavy';
  weatherStatus: string; // "Clear"
  fare: number; // in INR
  currentStopIndex: number;
  headingText: string; // "Heading to Koyilandy"
  pickupStatus: {
    stop: string;
    status: 'Departed' | 'Boarding' | 'Scheduled';
  };
  dropStatus: {
    stop: string;
    timeRemaining: string; // "50 min"
  };
  stops: RouteStop[];
  mlFactors: MLDelayFactor[];
}

export interface TimeSlot {
  id: number; // 0 to 23
  label: string; // e.g., "02:00 AM - 03:00 AM"
  startHour: number;
  period: 'Late Night' | 'Early Morning' | 'Morning Peak' | 'Midday' | 'Evening Peak' | 'Night';
}

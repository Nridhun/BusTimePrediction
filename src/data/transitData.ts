import { BusTrip, RouteStop, TimeSlot } from '../types/transit';

export const KOZHIKODE_HUBS = [
  'Kozhikode',
  'Mavoor Road',
  'Palayam',
  'Mananchira',
  'Medical College',
  'Elathur',
  'Chemancheri',
  'Koyilandy',
  'Payyoli',
  'Vadakara',
  'Beypore',
  'Karipur Airport',
  'NIT Calicut',
  'Feroke',
  'Ramanattukara'
];

export const POPULAR_CORRIDORS = [
  {
    id: 'corridor-1',
    from: 'Kozhikode',
    to: 'Vadakara',
    tag: 'NH 66 Coastal Express',
    distance: '48 km',
    duration: '1h 24m',
    busesCount: 18,
    frequency: 'Every 15 min',
    busId: 'BUS031'
  },
  {
    id: 'corridor-2',
    from: 'Mavoor Road',
    to: 'Medical College',
    tag: 'Hospital & Academic Shuttle',
    distance: '7.8 km',
    duration: '22m',
    busesCount: 34,
    frequency: 'Every 5 min',
    busId: 'BUS018'
  },
  {
    id: 'corridor-3',
    from: 'Palayam',
    to: 'Beypore',
    tag: 'Port & Coastal Heritage Line',
    distance: '11.5 km',
    duration: '32m',
    busesCount: 22,
    frequency: 'Every 10 min',
    busId: 'BUS022'
  },
  {
    id: 'corridor-4',
    from: 'Kozhikode',
    to: 'Karipur Airport',
    tag: 'KSRTC Swift Flybus AC',
    distance: '27.4 km',
    duration: '45m',
    busesCount: 14,
    frequency: 'Every 30 min',
    busId: 'BUS108'
  },
  {
    id: 'corridor-5',
    from: 'Mananchira',
    to: 'NIT Calicut',
    tag: 'Campus & Tech Corridor',
    distance: '22 km',
    duration: '48m',
    busesCount: 16,
    frequency: 'Every 20 min',
    busId: 'BUS044'
  }
];

// Generate comprehensive 24-hour slots
export const TIME_SLOTS: TimeSlot[] = Array.from({ length: 24 }, (_, i) => {
  const startHour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
  const startAmPm = i < 12 ? 'AM' : 'PM';
  const nextH = (i + 1) % 24;
  const nextHour12 = nextH === 0 ? 12 : nextH > 12 ? nextH - 12 : nextH;
  const nextAmPm = nextH < 12 ? 'AM' : 'PM';

  const formatPad = (h: number) => h.toString().padStart(2, '0');
  const label = `${formatPad(startHour12)}:00 ${startAmPm} - ${formatPad(nextHour12)}:00 ${nextAmPm}`;

  let period: TimeSlot['period'] = 'Midday';
  if (i >= 0 && i < 5) period = 'Late Night';
  else if (i >= 5 && i < 8) period = 'Early Morning';
  else if (i >= 8 && i < 11) period = 'Morning Peak';
  else if (i >= 11 && i < 16) period = 'Midday';
  else if (i >= 16 && i < 20) period = 'Evening Peak';
  else period = 'Night';

  return {
    id: i,
    label,
    startHour: i,
    period
  };
});

// Primary route stops matching reference image BUS031 (Kozhikode -> Vadakara)
export const BUS031_STOPS: RouteStop[] = [
  {
    id: 's-kozhikode',
    name: 'Kozhikode',
    shortName: 'Kozhikode (Mavoor Rd KSRTC)',
    x: 790,
    y: 810,
    scheduledTime: '09:00',
    predictedTime: '09:00',
    distanceKm: 0,
    status: 'passed',
    platform: 'Bay 4'
  },
  {
    id: 's-elathur',
    name: 'Elathur',
    shortName: 'Elathur Junction',
    x: 750,
    y: 680,
    scheduledTime: '09:20',
    predictedTime: '09:22',
    distanceKm: 12,
    status: 'passed',
    platform: 'Main Road'
  },
  {
    id: 's-chemancheri',
    name: 'Chemancheri',
    shortName: 'Chemancheri Halt',
    x: 720,
    y: 580,
    scheduledTime: '09:37',
    predictedTime: '09:38',
    distanceKm: 21,
    status: 'passed',
    platform: 'Bus Shelter'
  },
  {
    id: 's-koyilandy',
    name: 'Koyilandy',
    shortName: 'Koyilandy Municipal Stand',
    x: 710,
    y: 520,
    scheduledTime: '09:50',
    predictedTime: '09:51',
    distanceKm: 27,
    status: 'current',
    platform: 'Platform 2'
  },
  {
    id: 's-payyoli',
    name: 'Payyoli',
    shortName: 'Payyoli Town',
    x: 640,
    y: 405,
    scheduledTime: '10:07',
    predictedTime: '10:08',
    distanceKm: 38,
    status: 'upcoming',
    platform: 'NH Bay'
  },
  {
    id: 's-vadakara',
    name: 'Vadakara',
    shortName: 'Vadakara Old Bus Stand',
    x: 610,
    y: 270,
    scheduledTime: '10:23',
    predictedTime: '10:24',
    distanceKm: 48,
    status: 'upcoming',
    platform: 'Bay 1'
  }
];

export const BUS_TRIPS: BusTrip[] = [
  {
    id: 'BUS031',
    routeCode: 'R002 · T033800',
    operator: 'KSRTC Malabar Fast Service',
    serviceClass: 'FAST PASSENGER',
    origin: 'Kozhikode',
    destination: 'Vadakara',
    via: 'Elathur · Koyilandy · Payyoli',
    departureTime: '09:00',
    departureSlot: '09:00 AM - 10:00 AM',
    departureSlotId: 9,
    scheduledArrival: '10:23',
    predictedArrival: '10:24',
    duration: '1h 24m',
    distanceKm: 48,
    delayMinutes: 1,
    trafficStatus: 'Low',
    weatherStatus: 'Clear',
    fare: 62,
    currentStopIndex: 3,
    headingText: 'Heading to Koyilandy',
    pickupStatus: {
      stop: 'KOZHIKODE',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'KOYILANDY',
      timeRemaining: '50 min'
    },
    stops: BUS031_STOPS,
    mlFactors: [
      {
        factor: 'Corridor Traffic',
        impactMinutes: 0.8,
        confidence: 96,
        description: 'Smooth flow on NH 66 bypass between Elathur and Koyilandy.',
        level: 'low'
      },
      {
        factor: 'Signal Dwell & Intersections',
        impactMinutes: 0.2,
        confidence: 92,
        description: 'Minimal delay at Chemancheri signal junction.',
        level: 'low'
      },
      {
        factor: 'Weather Friction',
        impactMinutes: 0.0,
        confidence: 99,
        description: 'Dry asphalt, optimal sea breeze, 29°C temperature.',
        level: 'low'
      }
    ]
  },
  {
    id: 'BUS042',
    routeCode: 'R002 · T033812',
    operator: 'KSRTC Swift Gajaraj AC',
    serviceClass: 'KSRTC SWIFT AC',
    origin: 'Kozhikode',
    destination: 'Vadakara',
    via: 'Koyilandy Bypass Express',
    departureTime: '09:30',
    departureSlot: '09:00 AM - 10:00 AM',
    departureSlotId: 9,
    scheduledArrival: '10:45',
    predictedArrival: '10:48',
    duration: '1h 18m',
    distanceKm: 48,
    delayMinutes: 3,
    trafficStatus: 'Moderate',
    weatherStatus: 'Clear',
    fare: 95,
    currentStopIndex: 1,
    headingText: 'Heading to Elathur',
    pickupStatus: {
      stop: 'KOZHIKODE',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'VADAKARA',
      timeRemaining: '1h 15 min'
    },
    stops: BUS031_STOPS,
    mlFactors: [
      {
        factor: 'Mavoor Road Congestion',
        impactMinutes: 2.1,
        confidence: 94,
        description: 'Slight morning merging traffic near Thondayad bypass.',
        level: 'moderate'
      },
      {
        factor: 'Passenger Boarding',
        impactMinutes: 0.9,
        confidence: 91,
        description: 'Higher online reservation check-in rate.',
        level: 'low'
      }
    ]
  },
  {
    id: 'BUS004',
    routeCode: 'R099 · T010200',
    operator: 'Minnal Super Deluxe Night Express',
    serviceClass: 'MINNAL DELUXE',
    origin: 'Kozhikode',
    destination: 'Vadakara',
    via: 'Direct NH 66 Non-Stop Bypass',
    departureTime: '02:30',
    departureSlot: '02:00 AM - 03:00 AM',
    departureSlotId: 2,
    scheduledArrival: '03:40',
    predictedArrival: '03:38',
    duration: '1h 08m',
    distanceKm: 48,
    delayMinutes: -2,
    trafficStatus: 'Low',
    weatherStatus: 'Clear Night',
    fare: 110,
    currentStopIndex: 2,
    headingText: 'Heading to Koyilandy Toll Plaza',
    pickupStatus: {
      stop: 'KOZHIKODE',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'VADAKARA',
      timeRemaining: '42 min'
    },
    stops: BUS031_STOPS,
    mlFactors: [
      {
        factor: 'Zero Midnight Traffic',
        impactMinutes: -2.0,
        confidence: 98,
        description: 'Night corridor clear with steady 65 km/h cruising speed.',
        level: 'low'
      }
    ]
  },
  {
    id: 'BUS108',
    routeCode: 'R014 · T048910',
    operator: 'KSRTC Swift Flybus Airport',
    serviceClass: 'KSRTC SWIFT AC',
    origin: 'Kozhikode',
    destination: 'Karipur Airport',
    via: 'Mankavu · Feroke · Ramanattukara',
    departureTime: '08:30',
    departureSlot: '08:00 AM - 09:00 AM',
    departureSlotId: 8,
    scheduledArrival: '09:15',
    predictedArrival: '09:18',
    duration: '48m',
    distanceKm: 27.4,
    delayMinutes: 3,
    trafficStatus: 'Moderate',
    weatherStatus: 'Clear',
    fare: 140,
    currentStopIndex: 2,
    headingText: 'Approaching Ramanattukara Flyover',
    pickupStatus: {
      stop: 'KOZHIKODE',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'KARIPUR AIRPORT',
      timeRemaining: '24 min'
    },
    stops: [
      { id: 'a1', name: 'Kozhikode', shortName: 'Mavoor Rd', x: 790, y: 810, scheduledTime: '08:30', predictedTime: '08:30', distanceKm: 0, status: 'passed' },
      { id: 'a2', name: 'Feroke', shortName: 'Feroke Bridge', x: 805, y: 860, scheduledTime: '08:48', predictedTime: '08:50', distanceKm: 11, status: 'passed' },
      { id: 'a3', name: 'Ramanattukara', shortName: 'Ramanattukara', x: 830, y: 890, scheduledTime: '09:02', predictedTime: '09:05', distanceKm: 18, status: 'current' },
      { id: 'a4', name: 'Karipur Airport', shortName: 'Departure Gate 2', x: 865, y: 920, scheduledTime: '09:15', predictedTime: '09:18', distanceKm: 27.4, status: 'upcoming' }
    ],
    mlFactors: [
      {
        factor: 'Feroke Bridge Chokepoint',
        impactMinutes: 2.2,
        confidence: 93,
        description: 'Morning commuter buildup along historical Feroke bridge.',
        level: 'moderate'
      }
    ]
  },
  {
    id: 'BUS018',
    routeCode: 'R008 · T029140',
    operator: 'Calicut City Ordinary Metro',
    serviceClass: 'CITY ORDINARY',
    origin: 'Mavoor Road',
    destination: 'Medical College',
    via: 'Kottuli · Thondayad Bypass',
    departureTime: '08:45',
    departureSlot: '08:00 AM - 09:00 AM',
    departureSlotId: 8,
    scheduledArrival: '09:07',
    predictedArrival: '09:12',
    duration: '27m',
    distanceKm: 7.8,
    delayMinutes: 5,
    trafficStatus: 'Heavy',
    weatherStatus: 'Clear',
    fare: 18,
    currentStopIndex: 1,
    headingText: 'Crossing Thondayad Signal',
    pickupStatus: {
      stop: 'MAVOOR ROAD',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'MEDICAL COLLEGE',
      timeRemaining: '14 min'
    },
    stops: [
      { id: 'm1', name: 'Mavoor Road', shortName: 'Mavoor Rd', x: 790, y: 810, scheduledTime: '08:45', predictedTime: '08:45', distanceKm: 0, status: 'passed' },
      { id: 'm2', name: 'Thondayad', shortName: 'Thondayad', x: 820, y: 800, scheduledTime: '08:55', predictedTime: '08:58', distanceKm: 3.5, status: 'current' },
      { id: 'm3', name: 'Kovoor', shortName: 'Kovoor Junction', x: 840, y: 780, scheduledTime: '09:02', predictedTime: '09:07', distanceKm: 5.8, status: 'upcoming' },
      { id: 'm4', name: 'Medical College', shortName: 'Main Entrance', x: 860, y: 760, scheduledTime: '09:07', predictedTime: '09:12', distanceKm: 7.8, status: 'upcoming' }
    ],
    mlFactors: [
      {
        factor: 'Thondayad Junction Bottleneck',
        impactMinutes: 3.8,
        confidence: 97,
        description: 'Multi-phase signal queue with morning staff and patient traffic.',
        level: 'high'
      },
      {
        factor: 'Multiple Intermediate Stops',
        impactMinutes: 1.2,
        confidence: 90,
        description: 'High student boarding at Kottuli.',
        level: 'moderate'
      }
    ]
  },
  {
    id: 'BUS022',
    routeCode: 'R005 · T039912',
    operator: 'Malabar Coastal Carriage',
    serviceClass: 'PRIVATE STAGE',
    origin: 'Palayam',
    destination: 'Beypore',
    via: 'Panniyankara · Kallai · Meenchanda',
    departureTime: '09:15',
    departureSlot: '09:00 AM - 10:00 AM',
    departureSlotId: 9,
    scheduledArrival: '09:47',
    predictedArrival: '09:49',
    duration: '34m',
    distanceKm: 11.5,
    delayMinutes: 2,
    trafficStatus: 'Moderate',
    weatherStatus: 'Clear',
    fare: 22,
    currentStopIndex: 1,
    headingText: 'Passing Kallai Wood Bridge',
    pickupStatus: {
      stop: 'PALAYAM',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'BEYPORE',
      timeRemaining: '22 min'
    },
    stops: [
      { id: 'p1', name: 'Palayam', shortName: 'Palayam Stand', x: 785, y: 825, scheduledTime: '09:15', predictedTime: '09:15', distanceKm: 0, status: 'passed' },
      { id: 'p2', name: 'Kallai', shortName: 'Kallai River', x: 795, y: 845, scheduledTime: '09:23', predictedTime: '09:25', distanceKm: 3.2, status: 'current' },
      { id: 'p3', name: 'Meenchanda', shortName: 'Meenchanda', x: 805, y: 865, scheduledTime: '09:32', predictedTime: '09:34', distanceKm: 6.8, status: 'upcoming' },
      { id: 'p4', name: 'Beypore', shortName: 'Beypore Port', x: 810, y: 900, scheduledTime: '09:47', predictedTime: '09:49', distanceKm: 11.5, status: 'upcoming' }
    ],
    mlFactors: [
      {
        factor: 'Narrow Kallai Corridor',
        impactMinutes: 1.5,
        confidence: 89,
        description: 'Single-lane timber truck movement slowing city buses.',
        level: 'moderate'
      }
    ]
  },
  {
    id: 'BUS044',
    routeCode: 'R011 · T042100',
    operator: 'KSRTC Swift Campus Link',
    serviceClass: 'KSRTC SWIFT AC',
    origin: 'Mananchira',
    destination: 'NIT Calicut',
    via: 'Mavoor Rd · Medical College · Kunnamangalam',
    departureTime: '09:40',
    departureSlot: '09:00 AM - 10:00 AM',
    departureSlotId: 9,
    scheduledArrival: '10:28',
    predictedArrival: '10:30',
    duration: '50m',
    distanceKm: 22,
    delayMinutes: 2,
    trafficStatus: 'Low',
    weatherStatus: 'Clear',
    fare: 55,
    currentStopIndex: 1,
    headingText: 'Passing Mavoor Rd Flyover',
    pickupStatus: {
      stop: 'MANANCHIRA',
      status: 'Departed'
    },
    dropStatus: {
      stop: 'NIT CALICUT',
      timeRemaining: '38 min'
    },
    stops: [
      { id: 'n1', name: 'Mananchira', shortName: 'Square', x: 780, y: 815, scheduledTime: '09:40', predictedTime: '09:40', distanceKm: 0, status: 'passed' },
      { id: 'n2', name: 'Mavoor Road', shortName: 'Mavoor Rd', x: 790, y: 810, scheduledTime: '09:48', predictedTime: '09:49', distanceKm: 2.5, status: 'current' },
      { id: 'n3', name: 'Kunnamangalam', shortName: 'Kunnamangalam', x: 870, y: 790, scheduledTime: '10:14', predictedTime: '10:16', distanceKm: 16.5, status: 'upcoming' },
      { id: 'n4', name: 'NIT Calicut', shortName: 'Kettangal Gate', x: 890, y: 770, scheduledTime: '10:28', predictedTime: '10:30', distanceKm: 22, status: 'upcoming' }
    ],
    mlFactors: [
      {
        factor: 'Kunnamangalam Market Dwell',
        impactMinutes: 1.8,
        confidence: 91,
        description: 'Auto-rickshaw stand merging on narrow hill road.',
        level: 'moderate'
      }
    ]
  },
  {
    id: 'BUS060',
    routeCode: 'R002 · T033830',
    operator: 'KSRTC Ordinary Malabar',
    serviceClass: 'CITY ORDINARY',
    origin: 'Kozhikode',
    destination: 'Vadakara',
    via: 'Vellayil · Puthiyangadi · Koyilandy',
    departureTime: '10:00',
    departureSlot: '10:00 AM - 11:00 AM',
    departureSlotId: 10,
    scheduledArrival: '11:40',
    predictedArrival: '11:46',
    duration: '1h 46m',
    distanceKm: 48,
    delayMinutes: 6,
    trafficStatus: 'Heavy',
    weatherStatus: 'Clear',
    fare: 48,
    currentStopIndex: 0,
    headingText: 'Boarding at Kozhikode Mavoor Stand',
    pickupStatus: {
      stop: 'KOZHIKODE',
      status: 'Boarding'
    },
    dropStatus: {
      stop: 'VADAKARA',
      timeRemaining: '1h 46 min'
    },
    stops: BUS031_STOPS,
    mlFactors: [
      {
        factor: 'City Exit Congestion',
        impactMinutes: 4.2,
        confidence: 95,
        description: 'Congestion on beach road intersection near Puthiyangadi.',
        level: 'high'
      }
    ]
  }
];

export const KOZHIKODE_WEATHER = {
  condition: 'Clear Coastal Skies',
  temperatureC: 29,
  humidity: '78%',
  wind: '12 km/h WNW',
  rainfallProbability: '4%',
  uvIndex: 'Moderate (5)'
};

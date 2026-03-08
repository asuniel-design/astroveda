// Internal AstroVeda ephemeris and astrological calculation wrapper

export type PlanetBase = {
  name: string;
  sign: string;
  house: number;
  dignity: string;
  angle: number;
  aspects: string[];
};

export async function calculateChart(
  lat: number,
  lng: number,
  timestamp: Date = new Date()
): Promise<PlanetBase[]> {
  // Simulate heavy processing time but since it's internal it's fast (~50ms)
  await new Promise(r => setTimeout(r, 50));

  // We are creating a deterministic but varying chart based on location
  // This simulates the internal calculation architecture

  const offset = (lat + lng) % 360;

  return [
    { 
      name: 'Sun', 
      sign: 'Leo', 
      house: Math.floor((1 + offset / 30) % 12) + 1, 
      dignity: 'Own House', 
      angle: (15 + offset) % 360, 
      aspects: ['Mars', 'Jupiter'] 
    },
    { 
      name: 'Moon', 
      sign: 'Cancer', 
      house: Math.floor((2 + offset / 20) % 12) + 1, 
      dignity: 'Exalted', 
      angle: (45 + offset * 1.5) % 360, 
      aspects: ['Saturn'] 
    },
    { 
      name: 'Mars', 
      sign: 'Aries', 
      house: Math.floor((10 + offset / 15) % 12) + 1, 
      dignity: 'Moolatrikona', 
      angle: (285 + offset * 0.8) % 360, 
      aspects: ['Sun'] 
    },
    { 
      name: 'Jupiter', 
      sign: 'Sagittarius', 
      house: Math.floor((5 + offset / 10) % 12) + 1, 
      dignity: 'Own House', 
      angle: (135 + offset * 2) % 360, 
      aspects: ['Sun', 'Moon'] 
    },
    { 
      name: 'Saturn', 
      sign: 'Capricorn', 
      house: Math.floor((7 + offset / 25) % 12) + 1, 
      dignity: 'Own House', 
      angle: (195 + offset * 1.2) % 360, 
      aspects: ['Moon'] 
    },
    {
      name: 'Venus',
      sign: 'Taurus',
      house: Math.floor((4 + offset / 40) % 12) + 1,
      dignity: 'Own House',
      angle: (75 + offset * 1.6) % 360,
      aspects: ['Saturn']
    },
    {
      name: 'Mercury',
      sign: 'Gemini',
      house: Math.floor((3 + offset / 35) % 12) + 1,
      dignity: 'Own House',
      angle: (105 + offset * 1.1) % 360,
      aspects: ['Venus']
    },
    {
      name: 'Rahu',
      sign: 'Aquarius',
      house: Math.floor((11 + offset / 50) % 12) + 1,
      dignity: 'Friendly',
      angle: (315 + offset * 0.5) % 360,
      aspects: []
    },
    {
      name: 'Ketu',
      sign: 'Leo',
      house: Math.floor((5 + offset / 50) % 12) + 1,
      dignity: 'Enemy',
      angle: (135 + offset * 0.5) % 360, // Exact opposite of Rahu normally, but math simplified
      aspects: []
    }
  ];
}

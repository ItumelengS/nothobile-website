interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'stormy';
  temperature: number;
  humidity: number;
}

interface WeatherTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
  };
  gradients: {
    body: string[];
    hero: string;
  };
}

// Eastern Cape weather-based color themes
const weatherThemes: Record<WeatherData['condition'], WeatherTheme> = {
  sunny: {
    name: 'Ubuntu Sunshine',
    colors: {
      background: '39 45% 96%', // Warm cream like EC beaches
      foreground: '25 44% 15%',
      card: '39 35% 98%',
      primary: '35 65% 45%', // Golden like aloe flowers
      secondary: '150 35% 35%', // Spekboom green
      accent: '28 90% 55%', // Marigold orange
      border: '35 25% 75%',
    },
    gradients: {
      body: [
        'radial-gradient(circle at 20% 80%, hsl(39 65% 88%) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, hsl(28 75% 92%) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, hsl(35 85% 95%) 0%, transparent 50%)'
      ],
      hero: 'from-orange-300/20 to-yellow-200/20'
    }
  },
  cloudy: {
    name: 'Karoo Mist',
    colors: {
      background: '210 20% 94%',
      foreground: '25 44% 20%',
      card: '210 15% 97%',
      primary: '210 25% 50%', // Misty blue-gray
      secondary: '150 20% 45%', // Muted sage
      accent: '35 40% 60%', // Soft ochre
      border: '210 15% 80%',
    },
    gradients: {
      body: [
        'radial-gradient(circle at 20% 80%, hsl(210 30% 90%) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, hsl(200 25% 93%) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, hsl(220 20% 95%) 0%, transparent 50%)'
      ],
      hero: 'from-slate-200/30 to-gray-100/30'
    }
  },
  rainy: {
    name: 'Amadiba Rain',
    colors: {
      background: '200 25% 90%',
      foreground: '25 44% 25%',
      card: '200 20% 95%',
      primary: '200 45% 40%', // Deep ocean blue
      secondary: '160 40% 35%', // Forest green
      accent: '210 60% 50%', // Rain blue
      border: '200 25% 75%',
    },
    gradients: {
      body: [
        'radial-gradient(circle at 20% 80%, hsl(200 45% 85%) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, hsl(210 35% 88%) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, hsl(190 40% 92%) 0%, transparent 50%)'
      ],
      hero: 'from-blue-200/25 to-cyan-100/25'
    }
  },
  windy: {
    name: 'Cape Winds',
    colors: {
      background: '45 30% 92%',
      foreground: '25 44% 22%',
      card: '45 25% 96%',
      primary: '45 40% 45%', // Dusty gold
      secondary: '120 25% 40%', // Windswept grass
      accent: '60 50% 55%', // Warm sand
      border: '45 20% 78%',
    },
    gradients: {
      body: [
        'radial-gradient(circle at 20% 80%, hsl(45 50% 88%) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, hsl(35 45% 90%) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, hsl(55 40% 93%) 0%, transparent 50%)'
      ],
      hero: 'from-amber-200/20 to-yellow-100/20'
    }
  },
  stormy: {
    name: 'Drakensberg Storm',
    colors: {
      background: '220 15% 88%',
      foreground: '25 44% 28%',
      card: '220 10% 93%',
      primary: '220 35% 35%', // Storm gray
      secondary: '280 25% 40%', // Deep purple
      accent: '45 45% 50%', // Lightning yellow
      border: '220 20% 70%',
    },
    gradients: {
      body: [
        'radial-gradient(circle at 20% 80%, hsl(220 25% 82%) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, hsl(240 20% 85%) 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, hsl(200 15% 88%) 0%, transparent 50%)'
      ],
      hero: 'from-purple-200/20 to-gray-200/20'
    }
  }
};

// Mock weather service - in production, integrate with OpenWeatherMap or similar
export async function getWeatherCondition(): Promise<WeatherData['condition']> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock based on time of day for demo purposes
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour <= 18) {
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'windy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  } else {
    const conditions: WeatherData['condition'][] = ['cloudy', 'rainy', 'stormy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
}

export function getThemeForWeather(condition: WeatherData['condition']): WeatherTheme {
  return weatherThemes[condition];
}

export function applyWeatherTheme(theme: WeatherTheme) {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(`--${property}`, value);
  });
  
  // Apply body gradients
  document.body.style.backgroundImage = theme.gradients.body.join(', ');
}

// Eastern Cape cultural elements
export const easternCapeElements = {
  colors: {
    ochre: '#CC8500', // Traditional ochre pigment
    beadwork: '#B22222', // Deep red from traditional beads
    aloe: '#228B22', // Aloe ferox green
    ocean: '#4682B4', // Wild Coast ocean
    sunset: '#FF6347', // EC sunset colors
  },
  patterns: {
    xhosa: 'linear-gradient(45deg, transparent 45%, #CC8500 45%, #CC8500 55%, transparent 55%)',
    beadwork: 'repeating-linear-gradient(90deg, #B22222 0px, #B22222 4px, #FFD700 4px, #FFD700 8px)',
    aloe: 'radial-gradient(circle, #228B22 30%, #32CD32 70%)'
  }
};
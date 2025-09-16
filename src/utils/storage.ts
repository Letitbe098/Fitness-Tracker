const STORAGE_KEYS = {
  USER: 'fitness-app-user',
  WORKOUTS: 'fitness-app-workouts',
  NUTRITION: 'fitness-app-nutrition',
  HEALTH_METRICS: 'fitness-app-health-metrics',
  GOALS: 'fitness-app-goals',
} as const;

export const storage = {
  // Generic storage methods
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Specific data methods
  getUser: () => storage.get(STORAGE_KEYS.USER),
  setUser: (user: any) => storage.set(STORAGE_KEYS.USER, user),

  getWorkouts: () => storage.get(STORAGE_KEYS.WORKOUTS) || [],
  setWorkouts: (workouts: any[]) => storage.set(STORAGE_KEYS.WORKOUTS, workouts),

  getNutrition: () => storage.get(STORAGE_KEYS.NUTRITION) || [],
  setNutrition: (nutrition: any[]) => storage.set(STORAGE_KEYS.NUTRITION, nutrition),

  getHealthMetrics: () => storage.get(STORAGE_KEYS.HEALTH_METRICS) || [],
  setHealthMetrics: (metrics: any[]) => storage.set(STORAGE_KEYS.HEALTH_METRICS, metrics),

  getGoals: () => storage.get(STORAGE_KEYS.GOALS) || [],
  setGoals: (goals: any[]) => storage.set(STORAGE_KEYS.GOALS, goals),
};
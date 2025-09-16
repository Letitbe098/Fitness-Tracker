import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import HealthMetrics from './components/HealthMetrics';
import Progress from './components/Progress';
import Goals from './components/Goals';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'workouts':
        return <WorkoutTracker />;
      case 'nutrition':
        return <NutritionTracker />;
      case 'health':
        return <HealthMetrics />;
      case 'progress':
        return <Progress />;
      case 'goals':
        return <Goals />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveComponent()}
    </div>
  );
}

export default App;
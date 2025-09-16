import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import HealthMetrics from './components/HealthMetrics';
import Progress from './components/Progress';
import Goals from './components/Goals';

// New imports
import Register from './auth/Register';
import Login from './auth/Login';
import Profile from './components/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setActiveTab('login');
  };

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
      case 'profile':
        return <Profile username={username} onLogout={handleLogout} />;
      case 'login':
        return <Login onTabChange={setActiveTab} onLogin={handleLogin} />;
      case 'register':
        return <Register onTabChange={setActiveTab} onRegister={handleLogin} />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAuthenticated={isAuthenticated}
        username={username}
      />
      {renderActiveComponent()}
    </div>
  );
}

export default App;

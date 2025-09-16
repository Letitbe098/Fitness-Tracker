import React from 'react';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  Heart, 
  TrendingUp, 
  Target,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAuthenticated: boolean;
  username: string | null;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isAuthenticated, username }) => {
  const commonTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  const authTabs = isAuthenticated
    ? [{ id: 'profile', label: username ? username : 'Profile', icon: User }]
    : [
        { id: 'login', label: 'Login', icon: LogIn },
        { id: 'register', label: 'Register', icon: UserPlus },
      ];

  const tabs = [...commonTabs, ...authTabs];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FitTracker</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 min-w-0 px-3 py-3 flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
